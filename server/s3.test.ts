import { test } from "vitest"
import { s3uploadFile } from "./s3"

test("s3 upload file", async () => {
  await s3uploadFile(`test-${Date.now()}.txt`, "test")
})
