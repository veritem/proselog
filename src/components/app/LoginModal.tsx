import { Button } from "$src/components/ui/Button"
import { useRequestLoginLinkMutation } from "$src/generated/graphql"
import { getClientLoginNext } from "$src/lib/client-auth"
import { clientState } from "$src/lib/client-state"
import { Dialog } from "@headlessui/react"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { useSnapshot } from "valtio"

export const LoginModal: React.FC = () => {
  const [, requestLoginLinkMutation] = useRequestLoginLinkMutation()
  const [loginResult, setLoginResult] = useState<null | "success">(null)
  const { loginModalOpened } = useSnapshot(clientState)

  const form = useFormik({
    initialValues: {
      email: "",
    },
    async onSubmit(values) {
      setLoginResult(null)
      const { error } = await requestLoginLinkMutation({
        email: values.email,
        next: getClientLoginNext(),
      })
      if (error) {
        alert(error)
      } else {
        form.resetForm()
        setLoginResult("success")
      }
    },
  })

  useEffect(() => {
    if (!loginModalOpened) {
      setLoginResult(null)
    }
  }, [loginModalOpened])

  return (
    <Dialog
      open={loginModalOpened}
      onClose={() => (clientState.loginModalOpened = false)}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-white opacity-75" />

        <div className="relative bg-white rounded-lg overflow-hidden max-w-sm shadow-large w-full mx-auto">
          <Dialog.Title className="bg-zinc-200 h-12 flex items-center px-3 text-sm text-zinc-600 justify-center">
            Continue with Email
          </Dialog.Title>

          <div className="p-8">
            {loginResult === "success" && (
              <div className="mb-5">
                We just emailed you with a link to log in, please check your
                inbox and spam folder in case you can't find it.
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
        </div>
      </div>
    </Dialog>
  )
}

export default LoginModal
