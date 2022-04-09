import { AppLayout } from "$src/components/app/AppLayout"
import { Button } from "$src/components/ui/Button"
import { APP_NAME } from "$src/config"
import { useRequestLoginLinkMutation } from "$src/generated/graphql"
import { useFormik } from "formik"
import Link from "next/link"
import { useState } from "react"

export default function LoginPage() {
  const [, requestLoginLinkMutation] = useRequestLoginLinkMutation()
  const [loginResult, setLoginResult] = useState<null | "success">(null)

  const form = useFormik({
    initialValues: {
      email: "",
    },
    async onSubmit(values) {
      setLoginResult(null)
      const { error } = await requestLoginLinkMutation({
        email: values.email,
      })
      if (error) {
        alert(error)
      } else {
        form.resetForm()
        setLoginResult("success")
      }
    },
  })

  return (
    <AppLayout>
      <div className="max-w-sm mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-center">Log in</h2>
        {loginResult === "success" && (
          <div className="mb-5 bg-green-500 text-white rounded-lg px-5 py-3">
            We just emailed you with a link to log in, please check your inbox
            and spam folder in case you can't find it.
          </div>
        )}
        <form onSubmit={form.handleSubmit} className="space-y-5">
          <div>
            <label
              className="block mb-1 font-medium text-zinc-600"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="input is-block"
              onChange={form.handleChange}
              value={form.values.email}
            />
          </div>
          <div>
            <Button type="submit" isBlock isLoading={form.isSubmitting}>
              Continue
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
