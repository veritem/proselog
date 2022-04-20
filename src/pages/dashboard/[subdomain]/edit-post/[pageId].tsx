import { PageEditor } from "$src/components/app/PageEditor"
import { PageTypeEnum } from "$src/generated/graphql"

export default function EditPostPage() {
  return <PageEditor type={PageTypeEnum.Post} />
}
