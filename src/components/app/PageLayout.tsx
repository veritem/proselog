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
        {page.type === PageTypeEnum.Post ? (
          <h2 className="text-4xl font-bold">{page.title}</h2>
        ) : (
          <h2 className="text-xl font-bold page-title">{page.title}</h2>
        )}
        {page.type === PageTypeEnum.Post && (
          <div className="text-zinc-500 mt-1">
            {formatDate(page.publishedAt)}
          </div>
        )}
      </div>
      <div
        className="my-8 prose"
        dangerouslySetInnerHTML={{ __html: page.contentHTML }}
      ></div>
    </>
  )
}
