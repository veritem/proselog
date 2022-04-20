import { PageEditor } from "$src/components/app/PageEditor"
import { PageTypeEnum } from "$src/generated/graphql"

export default function EditPagePage() {
  return <PageEditor type={PageTypeEnum.Page} />
}
