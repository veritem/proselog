import { useEditor as useTiptap } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { CodeBlock } from "./extension-code-block"

export const useEditor = () => {
  const editor = useTiptap({
    content: "",
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "code-block",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose",
      },
    },
  })

  return editor
}
