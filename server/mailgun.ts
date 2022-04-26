import Mailgun from "mailgun.js"
import FormData from "form-data"
import { singleton } from "./singleton"
import { APP_NAME, IS_PROD } from "$src/config"
import { MailgunMessageData } from "mailgun.js/interfaces/Messages"

const DOMAIN = process.env.MAILGUN_DOMAIN

const getClient = () =>
  singleton("mailgun", () => {
    const mg = new Mailgun(FormData)
    const client = mg.client({
      username: "api",
      key: process.env.MAILGUN_APIKEY,
    })
    return client
  })

export const sendLoginEmail = async (loginLink: string, email: string) => {
  const message: MailgunMessageData = {
    from: `${APP_NAME} <hi@${process.env.OUR_DOMAIN}>`,
    to: email,
    subject: `Log in to ${APP_NAME}`,
    html: `<p>Please use the link below to log in to ${APP_NAME}:</p>

<a href="${loginLink}">login</a>

<p>This link will expire in 10 minutes.</p>
`,
  }

  if (!IS_PROD) {
    console.log(message)
    return
  }

  const client = getClient()

  await client.messages.create(DOMAIN, message)
}
