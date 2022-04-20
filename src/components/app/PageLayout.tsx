import { PageTypeEnum } from "$src/generated/graphql"
import { formatDate } from "$src/lib/date"

export const PageLayout: React.FC<{
  page: {
    type: PageTypeEnum
    publishedAt: string
    title: string
    contentHTML: string
  }
}> = ({ page }) => {
  return (
    <>
      <div className="">
        {page.type === PageTypeEnum.Post && (
          <div className="text-zinc-500">{formatDate(page.publishedAt)}</div>
        )}
        <h2 className="text-4xl font-bold mt-1">{page.title}</h2>
      </div>
      <div
        className="my-8 prose"
        dangerouslySetInnerHTML={{ __html: page.contentHTML }}
      ></div>
    </>
  )
}
