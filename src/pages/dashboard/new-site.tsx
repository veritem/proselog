import { AppLayout } from "$src/components/app/AppLayout"
import { Button } from "$src/components/ui/Button"
import {
  useCreateSiteMutation,
  useNewSiteDataQuery,
} from "$src/generated/graphql"
import { useFormik } from "formik"
import gql from "graphql-tag"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"

gql`
  query NewSiteData {
    viewer {
      id
      email
    }
  }
`

export default function NewSite() {
  const router = useRouter()
  const [, createSiteMutation] = useCreateSiteMutation()
  const [newSiteResult] = useNewSiteDataQuery()

  const form = useFormik({
    initialValues: {
      name: "",
      subdomain: "",
    },
    async onSubmit(values) {
      const { error } = await createSiteMutation({
        name: values.name,
        subdomain: values.subdomain,
      })
      if (error) {
        alert(error)
      } else {
        router.push(`/dashboard/${values.subdomain}`)
      }
    },
  })

  const viewer = newSiteResult.data?.viewer

  return (
    <>
      <Head>
        <title>Create a new site</title>
      </Head>
      <div>
        <header className="px-5 text-sm  md:px-14 flex justify-between items-start py-10">
          <Link href="/dashboard">
            <a className="flex space-x-1 items-center">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Back to dashboard</span>
            </a>
          </Link>
          <div>
            <div className="text-zinc-400">Logged in as:</div>
            <div>{viewer?.email}</div>
          </div>
        </header>
        <div className="max-w-sm mx-auto mt-20">
          <h2 className="text-3xl mb-10 text-center">Create a new site</h2>
          <form onSubmit={form.handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block">Site Name</label>
              <input
                type="text"
                name="name"
                className="input is-block"
                required
                value={form.values.name}
                onChange={form.handleChange}
              />
            </div>
            <div>
              <label className="mb-1 block">Subdomain</label>
              <input
                type="text"
                name="subdomain"
                className="input is-block"
                required
                value={form.values.subdomain}
                onChange={form.handleChange}
              />
            </div>
            <div>
              <Button type="submit" isBlock isLoading={form.isSubmitting}>
                Create
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
