import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters"),
  email: z.string().email("Invalid email address"),
  techs: z.array(
    z.object({
      title: z.string().min(1, "Tech title is required"),
    })
  ),
})

type FormSchema = z.infer<typeof formSchema>

const dataFromDB: FormSchema = {
  name: "John Doe",
  email: "john@doe.com",
  techs: [{ title: "React" }, { title: "NodeJS" }, { title: "TypeScript" }],
}

const App = () => {
  const [userInfo, setUserInfo] = useState<FormSchema | null>()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: dataFromDB,
  })

  const { fields, append, remove } = useFieldArray({
    name: "techs",
    control,
  })

  const addInputField = () => {
    append({ title: "" })
  }

  const removeInputField = (inputIndex: number) => {
    remove(inputIndex)
  }

  const handleSubmitForm = handleSubmit((data) => {
    setUserInfo(data)
  })

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-3">
      <div className="w-96 bg-zinc-900 p-6 rounded-lg space-y-4">
        <div>
          <h1 className="font-semibold text-xl">Multi Field Form</h1>
          <p className="text-zinc-400 text-sm">A multi field form</p>
        </div>
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="name"
              className={errors.name?.message && "text-red-500"}>
              Name
            </label>
            <div className="bg-zinc-800 px-4 h-11 flex items-center rounded-lg">
              <input
                {...register("name")}
                id="name"
                placeholder="Your name"
                className="w-full bg-transparent outline-none"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="email"
              className={errors.email?.message && "text-red-500"}>
              E-mail
            </label>
            <div className="bg-zinc-800 px-4 h-11 flex items-center rounded-lg">
              <input
                {...register("email")}
                id="email"
                placeholder="Your name"
                className="w-full bg-transparent outline-none"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="email" className={errors.techs && "text-red-500"}>
                Tecnologias
              </label>
              <button
                type="button"
                onClick={addInputField}
                className="p-1 bg-sky-500 rounded-md font-semibold">
                <Plus size={20} />
              </button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id}>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-zinc-800 px-4 h-11 flex items-center rounded-lg">
                    <input
                      {...register(`techs.${index}.title`)}
                      id="email"
                      placeholder="Your tech"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                  <button onClick={() => removeInputField(index)}>
                    <Trash2 size={20} />
                  </button>
                </div>
                {errors.techs?.[index]?.title?.message && (
                  <p className="text-xs text-red-500">
                    {errors.techs[index].title.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="h-11 w-full bg-sky-500 rounded-lg font-semibold">
            Enviar
          </button>
        </form>
      </div>

      {userInfo && <pre>{JSON.stringify(userInfo, null, 2)}</pre>}
    </div>
  )
}

export default App
