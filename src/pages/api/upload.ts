import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import multiparty, { File } from "multiparty"
import connect, { Middleware } from "next-connect"
import { corsMiddleware } from "$src/lib/api-routes"
import fs from "fs"
import { nanoid } from "nanoid"
import { getAuthUser } from "$server/auth"
import { s3uploadFile } from "$server/s3"

export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadMiddleware: Middleware<NextApiRequest, NextApiResponse> = (
  req,
  res,
  next,
) => {
  const form = new multiparty.Form({
    // maxFilesSize: 5000,
  })
  form.parse(req, (error, fields, files) => {
    req.body = fields
    // @ts-expect-error
    req.files = files
    next(error)
  })
}

const handler: NextApiHandler = async (req, res) => {
  const file = (req as any).files.file[0] as File | undefined
  const type = req.body.type?.[0] as string | undefined

  if (!file) {
    return res.status(400).json({ message: "No file" })
  }

  if (!type) {
    return res.status(400).json({ message: "No type" })
  }

  const user = await getAuthUser(req)

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (type === "image") {
    const filename = `${user.id}/${nanoid()}.jpg`
    await s3uploadFile(filename, fs.createReadStream(file.path))

    res.send({
      filename,
    })
    return
  }

  res.status(400).json({ message: "Invalid type" })
}

export default connect()
  .use(corsMiddleware())
  .use(uploadMiddleware)
  .use(handler)
