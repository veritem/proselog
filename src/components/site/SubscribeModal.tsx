import {
  useSubscribeModalDataQuery,
  useSubscribeToSiteMutation,
  useUnsubscribeToSiteMutation,
} from "$src/generated/graphql"
import { clientState } from "$src/lib/client-state"
import { useFormik } from "formik"
import gql from "graphql-tag"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSnapshot } from "valtio"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import { Modal } from "../ui/Modal"

gql`
  query SubscribeModalData($site: String!) {
    site(site: $site) {
      id
      subscription {
        id
        email
        telegram
      }
    }
  }
`

export const SubscribeModal: React.FC<{ siteId?: string }> = ({ siteId }) => {
  const { subscribeModalOpened } = useSnapshot(clientState)

  const [, subscribeToSiteMutation] = useSubscribeToSiteMutation()
  const [queryResult, refreshQueryResult] = useSubscribeModalDataQuery({
    variables: {
      site: siteId!,
    },
    pause: !siteId,
  })
  const [, unsubscribeToSiteMutation] = useUnsubscribeToSiteMutation()
  const [unsubscribing, setUnsubscribing] = useState(false)

  const subscription = queryResult.data?.site.subscription

  const form = useFormik({
    initialValues: {
      email: true,
      telegram: false,
    },
    async onSubmit(values) {
      if (!siteId) return

      const { error, data } = await subscribeToSiteMutation({
        siteId,
        email: values.email,
        telegram: values.telegram,
      })
      if (error) {
        toast.error(error.message)
      } else if (data) {
        toast.success(
          subscription ? "Subscription has been updated!" : "Subscribed!",
        )
        refreshQueryResult({ requestPolicy: "network-only" })
        clientState.subscribeModalOpened = false
      }
    },
  })

  const unsubscribe = async () => {
    if (!siteId) return
    try {
      setUnsubscribing(true)
      const { error, data } = await unsubscribeToSiteMutation({
        site: siteId,
      })
      if (error) {
        toast.error(error.message)
      } else if (data != null) {
        toast.success("Unsubscribed!")
        clientState.subscribeModalOpened = false
      }
    } finally {
      setUnsubscribing(false)
    }
  }

  useEffect(() => {
    if (subscription) {
      form.setValues({
        email: subscription.email ?? !!subscription.email,
        telegram: subscription.telegram ?? !!subscription.telegram,
      })
    }
  }, [subscription])

  return (
    <Modal
      title="Become a subscriber"
      open={subscribeModalOpened}
      setOpen={(open) => {
        clientState.subscribeModalOpened = open
      }}
    >
      <form className="p-5" onSubmit={form.handleSubmit}>
        <div>
          <label className="select-none flex items-center space-x-1">
            <input
              type="checkbox"
              checked={form.values.email}
              onChange={(e) => form.setFieldValue("email", e.target.checked)}
            />
            <Badge className="mr-1">Soon</Badge>
            <span>Receive updates via Email</span>
          </label>
        </div>
        <div className="">
          <label className="select-none flex items-center space-x-1">
            <input
              type="checkbox"
              checked={form.values.telegram}
              onChange={(e) => form.setFieldValue("telegram", e.target.checked)}
            />
            <Badge>Soon</Badge>
            <span>Receive updates via Telegram</span>
          </label>
        </div>
        <div className="mt-5 space-x-3">
          <Button type="submit" isLoading={form.isSubmitting}>
            <span>{subscription ? "Update" : "Subscribe"}</span>
          </Button>
          {subscription && (
            <Button
              type="button"
              variant="secondary"
              isLoading={unsubscribing}
              onClick={unsubscribe}
            >
              Unsubscribe
            </Button>
          )}
        </div>
      </form>
    </Modal>
  )
}
