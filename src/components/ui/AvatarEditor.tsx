import { Dialog } from "@headlessui/react"
import { useRef, useState } from "react"
import ReactAvatarEditor from "react-avatar-editor"
import { Button } from "./Button"

type SaveAvatar = (blob: Blob) => Promise<void>

const AvatarEditorModal: React.FC<{
  isOpen: boolean
  image?: File | null
  setIsOpen: (open: boolean) => void
  saveAvatar: SaveAvatar
}> = ({ isOpen, setIsOpen, image, saveAvatar }) => {
  const editorRef = useRef<ReactAvatarEditor | null>(null)

  const cropAndSave = async () => {
    if (!editorRef.current) return
    const canvas = editorRef.current.getImage()
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas is empty"))
        resolve(blob)
      })
    })
    await saveAvatar(blob)
    setIsOpen(false)
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-md w-full mx-auto">
          <Dialog.Title className="px-5 h-12 flex items-center border-b">
            Adjust the picture
          </Dialog.Title>

          <div className="py-5">
            {image && (
              <ReactAvatarEditor
                ref={editorRef}
                className="mx-auto rounded"
                image={image}
                borderRadius={9999}
              />
            )}
          </div>

          <div className="h-16 border-t flex items-center px-5">
            <Button isBlock onClick={cropAndSave}>
              Crop and Save
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export const AvatarEditor: React.FC<{
  render: (options: { onClick: () => void }) => React.ReactNode
  saveAvatar: SaveAvatar
}> = ({ render, saveAvatar }) => {
  const [isOpen, setIsOpen] = useState(false)
  const inputEl = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<File | null>(null)

  const onClick = () => {
    inputEl.current?.click()
  }

  const handleChange = (e: any) => {
    const files = e.target.files as File[]
    if (files.length > 0) {
      setImage(files[0])
      setIsOpen(true)
    }
  }

  return (
    <>
      <AvatarEditorModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        image={image}
        saveAvatar={saveAvatar}
      />
      <input
        aria-hidden
        className="hidden"
        type="file"
        ref={inputEl}
        onChange={handleChange}
        accept="image/*"
      />
      {render({ onClick })}
    </>
  )
}
