import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import multiparty, { File } from "multiparty"
import connect, { Middleware } from "next-connect"
import { corsMiddleware } from "$src/lib/api-routes"
import fs from "fs"
import { nanoid } from "nanoid"

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

  if (file) {
    const filename = `${nanoid()}.jpg`
    fs.mkdirSync("./public/uploads", { recursive: true })
    fs.copyFileSync(file.path, `./public/uploads/${filename}`)
    res.send({
      url: `/uploads/${filename}`,
    })
    return
  }

  res.status(400)
  res.end("no file")
}

export default connect()
  .use(corsMiddleware())
  .use(uploadMiddleware)
  .use(handler)
