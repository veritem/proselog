import { getAuthTokenFromRequest } from "$server/auth"
import { getGraphqlEndpoint } from "$server/graphql-schema"
import { PageLayout } from "$src/components/app/PageLayout"
import { UserSiteLayout } from "$src/components/app/UserSiteLayout"
import {
  PageTypeEnum,
  SitePageQueryDocument,
  SitePageQueryQuery,
  SitePageQueryQueryVariables,
  UserSiteLayoutDocument,
  UserSiteLayoutQuery,
  UserSiteLayoutQueryVariables,
  useSitePageQueryQuery,
} from "$src/generated/graphql"
import { notFound, serverSidePropsHandler } from "$src/lib/server-side-props"
import { createUrqlClient } from "$src/lib/urql-client"
import { useRouter } from "next/router"
import { gql } from "urql"

gql`
  query SitePageQuery($domainOrSubdomain: String!, $slugOrId: String!) {
    site(domainOrSubdomain: $domainOrSubdomain) {
      id
      name
    }
    page(slugOrId: $slugOrId, domainOrSubdomain: $domainOrSubdomain) {
      id
      title
      type
      permalink
      publishedAt
      contentHTML
    }
  }
`

type Props = {
  urqlState: any
  domainOrSubdomain: string
  slug: string
}

export const getServerSideProps = serverSidePropsHandler<Props>(async (ctx) => {
  const { client, ssr } = createUrqlClient({
    token: getAuthTokenFromRequest(ctx.req),
    endpoint: getGraphqlEndpoint(ctx.req),
  })
  const domainOrSubdomain = ctx.query.domain as string
  const slug = ctx.query.page as string
  await Promise.all([
    client
      .query<SitePageQueryQuery, SitePageQueryQueryVariables>(
        SitePageQueryDocument,
        {
          domainOrSubdomain,
          slugOrId: slug,
        },
      )
      .toPromise(),
    client
      .query<UserSiteLayoutQuery, UserSiteLayoutQueryVariables>(
        UserSiteLayoutDocument,
        { domainOrSubdomain },
      )
      .toPromise(),
  ]).then((results) => {
    for (const item of results) {
      if (item.error) {
        throw item.error
      }
    }
    if (!results[0].data?.page) {
      throw notFound()
    }
  })
  const urqlState = ssr.extractData()
  return {
    props: { urqlState, domainOrSubdomain, slug },
  }
})

export default function SitePage({ domainOrSubdomain, slug }: Props) {
  const [queryResult] = useSitePageQueryQuery({
    variables: {
      domainOrSubdomain: domainOrSubdomain,
      slugOrId: slug,
    },
  })

  const page = queryResult.data?.page

  if (!page) {
    return null
  }

  const useHomeHeader = page.type === PageTypeEnum.Page
  return (
    <UserSiteLayout title={page?.title} useHomeHeader={useHomeHeader}>
      <PageLayout page={page} />
    </UserSiteLayout>
  )
}
