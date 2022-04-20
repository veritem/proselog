import { PageTypeEnum } from "$src/generated/graphql"
import { PagesManager } from "$src/components/app/PagesManager"

export default function DashboardPagesPage() {
  return <PagesManager type={PageTypeEnum.Page} />
}
