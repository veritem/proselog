import { API_ENDPOINT } from "$src/config"

export const uploadFileInBrowser = async (blob: Blob) => {
  const form = new FormData()
  form.append("file", blob)
  const res = await fetch(`${API_ENDPOINT}/api/upload`, {
    credentials: "same-origin",
    body: form,
    method: "POST",
  })
  if (!res.ok) {
    throw new Error(`Upload failed: ${res.statusText}`)
  }
  const json = await res.json()
  return json as { url: string }
}
