import { getAuthTokenFromRequest } from "$server/auth"
import { getGraphqlEndpoint } from "$server/graphql-schema"
import { PageLayout } from "$src/components/site/PageLayout"
import { SiteLayout } from "$src/components/site/SiteLayout"
import {
  SitePageQueryDocument,
  SitePageQueryQuery,
  SitePageQueryQueryVariables,
  SiteLayoutDataDocument,
  SiteLayoutDataQuery,
  SiteLayoutDataQueryVariables,
  useSitePageQueryQuery,
} from "$src/generated/graphql"
import {
  handleUrqlErrorServerSide,
  serverSidePropsHandler,
} from "$src/lib/server-side-props"
import { createUrqlClient } from "$src/lib/urql-client"
import { gql } from "urql"

gql`
  query SitePageQuery($site: String!, $slugOrId: String!) {
    site(site: $site) {
      id
      name
    }
    page(slugOrId: $slugOrId, site: $site) {
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
          site: domainOrSubdomain,
          slugOrId: slug,
        },
      )
      .toPromise(),
    client
      .query<SiteLayoutDataQuery, SiteLayoutDataQueryVariables>(
        SiteLayoutDataDocument,
        { site: domainOrSubdomain },
      )
      .toPromise(),
  ]).then(handleUrqlErrorServerSide)

  const urqlState = ssr.extractData()
  return {
    props: { urqlState, domainOrSubdomain, slug },
  }
})

export default function SitePage({ domainOrSubdomain, slug }: Props) {
  const [queryResult] = useSitePageQueryQuery({
    variables: {
      site: domainOrSubdomain,
      slugOrId: slug,
    },
  })

  const page = queryResult.data?.page

  if (!page) {
    return null
  }

  return (
    <SiteLayout title={page?.title}>
      <PageLayout page={page} />
    </SiteLayout>
  )
}
