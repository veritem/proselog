import { DocumentNode } from "graphql"
import * as Urql from "urql"
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any
}

export type Membership = {
  __typename?: "Membership"
  id: Scalars["String"]
  role: Scalars["String"]
  site: Site
  siteId: Scalars["String"]
  userId: Scalars["String"]
}

export type Mutation = {
  __typename?: "Mutation"
  createOrUpdatePage: Page
  createSite: Site
  deletePage: Scalars["Boolean"]
  deleteSite: Scalars["Boolean"]
  requestLoginLink: Scalars["Boolean"]
  updateMembershipLastSwitchedTo: Scalars["Boolean"]
  updateSite: Site
  updateUserProfile: User
}

export type MutationCreateOrUpdatePageArgs = {
  content?: InputMaybe<Scalars["String"]>
  excerpt?: InputMaybe<Scalars["String"]>
  pageId?: InputMaybe<Scalars["String"]>
  published?: InputMaybe<Scalars["Boolean"]>
  publishedAt?: InputMaybe<Scalars["DateTime"]>
  siteId: Scalars["String"]
  slug?: InputMaybe<Scalars["String"]>
  title?: InputMaybe<Scalars["String"]>
  type?: InputMaybe<PageTypeEnum>
}

export type MutationCreateSiteArgs = {
  name: Scalars["String"]
  subdomain: Scalars["String"]
}

export type MutationDeletePageArgs = {
  id: Scalars["String"]
}

export type MutationDeleteSiteArgs = {
  id: Scalars["String"]
}

export type MutationRequestLoginLinkArgs = {
  email: Scalars["String"]
  next: Scalars["String"]
}

export type MutationUpdateMembershipLastSwitchedToArgs = {
  siteId: Scalars["String"]
}

export type MutationUpdateSiteArgs = {
  description?: InputMaybe<Scalars["String"]>
  icon?: InputMaybe<Scalars["String"]>
  id: Scalars["String"]
  name?: InputMaybe<Scalars["String"]>
  subdomain?: InputMaybe<Scalars["String"]>
}

export type MutationUpdateUserProfileArgs = {
  avatar?: InputMaybe<Scalars["String"]>
  email?: InputMaybe<Scalars["String"]>
  name?: InputMaybe<Scalars["String"]>
  userId: Scalars["String"]
  username?: InputMaybe<Scalars["String"]>
}

export type Page = {
  __typename?: "Page"
  autoExcerpt: Scalars["String"]
  content: Scalars["String"]
  contentHTML: Scalars["String"]
  createdAt: Scalars["DateTime"]
  excerpt: Scalars["String"]
  id: Scalars["String"]
  permalink: Scalars["String"]
  published: Scalars["Boolean"]
  publishedAt: Scalars["DateTime"]
  site: Site
  siteId: Scalars["String"]
  slug: Scalars["String"]
  title: Scalars["String"]
  type: PageTypeEnum
  updatedAt: Scalars["DateTime"]
}

export enum PageTypeEnum {
  Page = "PAGE",
  Post = "POST",
}

export enum PageVisibilityEnum {
  All = "ALL",
  Draft = "DRAFT",
  Published = "PUBLISHED",
  Scheduled = "SCHEDULED",
}

export type PagesConnection = {
  __typename?: "PagesConnection"
  nodes: Array<Page>
  pagination: Pagination
}

export type Pagination = {
  __typename?: "Pagination"
  hasMore: Scalars["Boolean"]
  total: Scalars["Int"]
}

export type Query = {
  __typename?: "Query"
  page: Page
  site: Site
  user?: Maybe<User>
  viewer?: Maybe<User>
}

export type QueryPageArgs = {
  domainOrSubdomain?: InputMaybe<Scalars["String"]>
  slugOrId: Scalars["String"]
}

export type QuerySiteArgs = {
  domainOrSubdomain: Scalars["String"]
}

export type QueryUserArgs = {
  username: Scalars["String"]
}

export type Site = {
  __typename?: "Site"
  createdAt: Scalars["DateTime"]
  description?: Maybe<Scalars["String"]>
  icon?: Maybe<Scalars["String"]>
  id: Scalars["String"]
  name: Scalars["String"]
  owner: User
  pages: PagesConnection
  stats: SiteStats
  subdomain: Scalars["String"]
  updatedAt: Scalars["DateTime"]
  userId: Scalars["String"]
}

export type SitePagesArgs = {
  cursor?: InputMaybe<Scalars["String"]>
  take?: InputMaybe<Scalars["Int"]>
  type?: InputMaybe<PageTypeEnum>
  visibility?: InputMaybe<PageVisibilityEnum>
}

export type SiteStats = {
  __typename?: "SiteStats"
  id: Scalars["String"]
  postCount: Scalars["Int"]
  subscriberCount: Scalars["Int"]
}

export type User = {
  __typename?: "User"
  avatar?: Maybe<Scalars["String"]>
  createdAt: Scalars["DateTime"]
  email: Scalars["String"]
  emailVerified?: Maybe<Scalars["Boolean"]>
  id: Scalars["String"]
  memberships: Array<Membership>
  name: Scalars["String"]
  site: Site
  updatedAt: Scalars["DateTime"]
  username: Scalars["String"]
}

export type UserMembershipsArgs = {
  roles: Array<Scalars["String"]>
}

export type UserSiteArgs = {
  domainOrSubdomain: Scalars["String"]
}

export type DashboardSiteDataQueryVariables = Exact<{
  domainOrSubdomain: Scalars["String"]
}>

export type DashboardSiteDataQuery = {
  __typename?: "Query"
  site: { __typename?: "Site"; id: string; name: string }
}

export type SitesForSiteSwitcherQueryVariables = Exact<{ [key: string]: never }>

export type SitesForSiteSwitcherQuery = {
  __typename?: "Query"
  viewer?: {
    __typename?: "User"
    id: string
    email: string
    emailVerified?: boolean | null
    memberships: Array<{
      __typename?: "Membership"
      id: string
      site: {
        __typename?: "Site"
        id: string
        name: string
        subdomain: string
        icon?: string | null
      }
    }>
  } | null
}

export type UserSiteLayoutQueryVariables = Exact<{
  domainOrSubdomain: Scalars["String"]
}>

export type UserSiteLayoutQuery = {
  __typename?: "Query"
  site: {
    __typename?: "Site"
    id: string
    name: string
    description?: string | null
    subdomain: string
    icon?: string | null
    owner: {
      __typename?: "User"
      id: string
      name: string
      avatar?: string | null
    }
  }
}

export type CreateOrUpdatePageMutationVariables = Exact<{
  siteId: Scalars["String"]
  pageId?: InputMaybe<Scalars["String"]>
  title?: InputMaybe<Scalars["String"]>
  content?: InputMaybe<Scalars["String"]>
  published?: InputMaybe<Scalars["Boolean"]>
  publishedAt?: InputMaybe<Scalars["DateTime"]>
  type?: InputMaybe<PageTypeEnum>
}>

export type CreateOrUpdatePageMutation = {
  __typename?: "Mutation"
  createOrUpdatePage: { __typename?: "Page"; id: string }
}

export type CreateSiteMutationVariables = Exact<{
  name: Scalars["String"]
  subdomain: Scalars["String"]
}>

export type CreateSiteMutation = {
  __typename?: "Mutation"
  createSite: {
    __typename?: "Site"
    id: string
    name: string
    subdomain: string
  }
}

export type DeletePageMutationVariables = Exact<{
  id: Scalars["String"]
}>

export type DeletePageMutation = {
  __typename?: "Mutation"
  deletePage: boolean
}

export type DeleteSiteMutationVariables = Exact<{
  id: Scalars["String"]
}>

export type DeleteSiteMutation = {
  __typename?: "Mutation"
  deleteSite: boolean
}

export type PageForEditPageQueryVariables = Exact<{
  slugOrId: Scalars["String"]
}>

export type PageForEditPageQuery = {
  __typename?: "Query"
  page: {
    __typename?: "Page"
    id: string
    slug: string
    title: string
    type: PageTypeEnum
    content: string
    publishedAt: any
    published: boolean
  }
}

export type RequestLoginLinkMutationVariables = Exact<{
  email: Scalars["String"]
  next: Scalars["String"]
}>

export type RequestLoginLinkMutation = {
  __typename?: "Mutation"
  requestLoginLink: boolean
}

export type SiteQueryVariables = Exact<{
  domainOrSubdomain: Scalars["String"]
}>

export type SiteQuery = {
  __typename?: "Query"
  site: {
    __typename?: "Site"
    id: string
    name: string
    icon?: string | null
    subdomain: string
    description?: string | null
  }
}

export type SiteIdBySubdomainQueryVariables = Exact<{
  subdomain: Scalars["String"]
}>

export type SiteIdBySubdomainQuery = {
  __typename?: "Query"
  site: { __typename?: "Site"; id: string }
}

export type SitePagesQueryVariables = Exact<{
  domainOrSubdomain: Scalars["String"]
  visibility?: InputMaybe<PageVisibilityEnum>
  type?: InputMaybe<PageTypeEnum>
}>

export type SitePagesQuery = {
  __typename?: "Query"
  site: {
    __typename?: "Site"
    id: string
    name: string
    pages: {
      __typename?: "PagesConnection"
      nodes: Array<{
        __typename?: "Page"
        id: string
        title: string
        type: PageTypeEnum
        content: string
        publishedAt: any
        published: boolean
      }>
    }
  }
}

export type UpdateMembershipLastSwitchedToMutationVariables = Exact<{
  siteId: Scalars["String"]
}>

export type UpdateMembershipLastSwitchedToMutation = {
  __typename?: "Mutation"
  updateMembershipLastSwitchedTo: boolean
}

export type UpdateSiteMutationVariables = Exact<{
  id: Scalars["String"]
  name?: InputMaybe<Scalars["String"]>
  subdomain?: InputMaybe<Scalars["String"]>
  description?: InputMaybe<Scalars["String"]>
  icon?: InputMaybe<Scalars["String"]>
}>

export type UpdateSiteMutation = {
  __typename?: "Mutation"
  updateSite: { __typename?: "Site"; id: string }
}

export type UpdateUserProfileMutationVariables = Exact<{
  userId: Scalars["String"]
  name?: InputMaybe<Scalars["String"]>
  username?: InputMaybe<Scalars["String"]>
  email?: InputMaybe<Scalars["String"]>
  avatar?: InputMaybe<Scalars["String"]>
}>

export type UpdateUserProfileMutation = {
  __typename?: "Mutation"
  updateUserProfile: { __typename?: "User"; id: string }
}

export type ViewerQueryVariables = Exact<{ [key: string]: never }>

export type ViewerQuery = {
  __typename?: "Query"
  viewer?: {
    __typename?: "User"
    id: string
    name: string
    username: string
    avatar?: string | null
    email: string
    emailVerified?: boolean | null
  } | null
}

export type SitePageQueryQueryVariables = Exact<{
  domainOrSubdomain: Scalars["String"]
  slugOrId: Scalars["String"]
}>

export type SitePageQueryQuery = {
  __typename?: "Query"
  site: { __typename?: "Site"; id: string; name: string }
  page: {
    __typename?: "Page"
    id: string
    title: string
    type: PageTypeEnum
    permalink: string
    publishedAt: any
    contentHTML: string
  }
}

export type SiteArchivesPageQueryVariables = Exact<{
  domainOrSubdomain: Scalars["String"]
}>

export type SiteArchivesPageQuery = {
  __typename?: "Query"
  site: {
    __typename?: "Site"
    id: string
    posts: {
      __typename?: "PagesConnection"
      nodes: Array<{
        __typename?: "Page"
        id: string
        title: string
        slug: string
        publishedAt: any
      }>
    }
  }
}

export type SiteIndexPageQueryVariables = Exact<{
  domainOrSubdomain: Scalars["String"]
}>

export type SiteIndexPageQuery = {
  __typename?: "Query"
  site: {
    __typename?: "Site"
    id: string
    posts: {
      __typename?: "PagesConnection"
      nodes: Array<{
        __typename?: "Page"
        id: string
        title: string
        permalink: string
        publishedAt: any
        autoExcerpt: string
      }>
    }
  }
}

export type SubdomainIndexDataQueryVariables = Exact<{
  domainOrSubdomain: Scalars["String"]
}>

export type SubdomainIndexDataQuery = {
  __typename?: "Query"
  site: {
    __typename?: "Site"
    id: string
    name: string
    subdomain: string
    stats: {
      __typename?: "SiteStats"
      id: string
      postCount: number
      subscriberCount: number
    }
  }
}

export type NewSiteDataQueryVariables = Exact<{ [key: string]: never }>

export type NewSiteDataQuery = {
  __typename?: "Query"
  viewer?: { __typename?: "User"; id: string; email: string } | null
}

export const DashboardSiteDataDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "DashboardSiteData" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "domainOrSubdomain" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "site" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "domainOrSubdomain" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "domainOrSubdomain" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useDashboardSiteDataQuery(
  options: Omit<Urql.UseQueryArgs<DashboardSiteDataQueryVariables>, "query">,
) {
  return Urql.useQuery<DashboardSiteDataQuery>({
    query: DashboardSiteDataDocument,
    ...options,
  })
}
export const SitesForSiteSwitcherDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "sitesForSiteSwitcher" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "viewer" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "emailVerified" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "memberships" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "roles" },
                      value: {
                        kind: "ListValue",
                        values: [
                          { kind: "StringValue", value: "ADMIN", block: false },
                          { kind: "StringValue", value: "OWNER", block: false },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "site" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "subdomain" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "icon" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useSitesForSiteSwitcherQuery(
  options?: Omit<
    Urql.UseQueryArgs<SitesForSiteSwitcherQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<SitesForSiteSwitcherQuery>({
    query: SitesForSiteSwitcherDocument,
    ...options,
  })
}
export const UserSiteLayoutDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "UserSiteLayout" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "domainOrSubdomain" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "site" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "domainOrSubdomain" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "domainOrSubdomain" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "subdomain" } },
                { kind: "Field", name: { kind: "Name", value: "icon" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "owner" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "avatar" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useUserSiteLayoutQuery(
  options: Omit<Urql.UseQueryArgs<UserSiteLayoutQueryVariables>, "query">,
) {
  return Urql.useQuery<UserSiteLayoutQuery>({
    query: UserSiteLayoutDocument,
    ...options,
  })
}
export const CreateOrUpdatePageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "createOrUpdatePage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "siteId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "pageId" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "title" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "content" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "published" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "publishedAt" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "DateTime" },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "type" } },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "PageTypeEnum" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createOrUpdatePage" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "siteId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "siteId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "pageId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "pageId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "title" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "title" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "content" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "content" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "published" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "published" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "publishedAt" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "publishedAt" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "type" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "type" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useCreateOrUpdatePageMutation() {
  return Urql.useMutation<
    CreateOrUpdatePageMutation,
    CreateOrUpdatePageMutationVariables
  >(CreateOrUpdatePageDocument)
}
export const CreateSiteDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "createSite" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "subdomain" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createSite" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "name" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "subdomain" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "subdomain" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "subdomain" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useCreateSiteMutation() {
  return Urql.useMutation<CreateSiteMutation, CreateSiteMutationVariables>(
    CreateSiteDocument,
  )
}
export const DeletePageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "deletePage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deletePage" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useDeletePageMutation() {
  return Urql.useMutation<DeletePageMutation, DeletePageMutationVariables>(
    DeletePageDocument,
  )
}
export const DeleteSiteDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "deleteSite" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteSite" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useDeleteSiteMutation() {
  return Urql.useMutation<DeleteSiteMutation, DeleteSiteMutationVariables>(
    DeleteSiteDocument,
  )
}
export const PageForEditPageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "PageForEditPage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "slugOrId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "page" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "slugOrId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "slugOrId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "type" } },
                { kind: "Field", name: { kind: "Name", value: "content" } },
                { kind: "Field", name: { kind: "Name", value: "publishedAt" } },
                { kind: "Field", name: { kind: "Name", value: "published" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function usePageForEditPageQuery(
  options: Omit<Urql.UseQueryArgs<PageForEditPageQueryVariables>, "query">,
) {
  return Urql.useQuery<PageForEditPageQuery>({
    query: PageForEditPageDocument,
    ...options,
  })
}
export const RequestLoginLinkDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "requestLoginLink" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "email" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "next" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "requestLoginLink" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "email" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "email" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "next" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "next" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useRequestLoginLinkMutation() {
  return Urql.useMutation<
    RequestLoginLinkMutation,
    RequestLoginLinkMutationVariables
  >(RequestLoginLinkDocument)
}
export const SiteDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "site" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "domainOrSubdomain" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "site" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "domainOrSubdomain" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "domainOrSubdomain" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "icon" } },
                { kind: "Field", name: { kind: "Name", value: "subdomain" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useSiteQuery(
  options: Omit<Urql.UseQueryArgs<SiteQueryVariables>, "query">,
) {
  return Urql.useQuery<SiteQuery>({ query: SiteDocument, ...options })
}
export const SiteIdBySubdomainDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SiteIdBySubdomain" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "subdomain" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "site" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "domainOrSubdomain" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "subdomain" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useSiteIdBySubdomainQuery(
  options: Omit<Urql.UseQueryArgs<SiteIdBySubdomainQueryVariables>, "query">,
) {
  return Urql.useQuery<SiteIdBySubdomainQuery>({
    query: SiteIdBySubdomainDocument,
    ...options,
  })
}
export const SitePagesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SitePages" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "domainOrSubdomain" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "visibility" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "PageVisibilityEnum" },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "type" } },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "PageTypeEnum" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "site" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "domainOrSubdomain" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "domainOrSubdomain" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pages" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "visibility" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "visibility" },
                      },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "type" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "type" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "title" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "type" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "content" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "publishedAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "published" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useSitePagesQuery(
  options: Omit<Urql.UseQueryArgs<SitePagesQueryVariables>, "query">,
) {
  return Urql.useQuery<SitePagesQuery>({ query: SitePagesDocument, ...options })
}
export const UpdateMembershipLastSwitchedToDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "updateMembershipLastSwitchedTo" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "siteId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateMembershipLastSwitchedTo" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "siteId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "siteId" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useUpdateMembershipLastSwitchedToMutation() {
  return Urql.useMutation<
    UpdateMembershipLastSwitchedToMutation,
    UpdateMembershipLastSwitchedToMutationVariables
  >(UpdateMembershipLastSwitchedToDocument)
}
export const UpdateSiteDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "updateSite" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "subdomain" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "description" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "icon" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateSite" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "name" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "subdomain" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "subdomain" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "description" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "description" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "icon" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "icon" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useUpdateSiteMutation() {
  return Urql.useMutation<UpdateSiteMutation, UpdateSiteMutationVariables>(
    UpdateSiteDocument,
  )
}
export const UpdateUserProfileDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "updateUserProfile" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "userId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "username" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "email" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "avatar" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateUserProfile" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "userId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "userId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "name" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "username" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "username" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "email" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "email" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "avatar" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "avatar" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useUpdateUserProfileMutation() {
  return Urql.useMutation<
    UpdateUserProfileMutation,
    UpdateUserProfileMutationVariables
  >(UpdateUserProfileDocument)
}
export const ViewerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "viewer" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "viewer" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "username" } },
                { kind: "Field", name: { kind: "Name", value: "avatar" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "emailVerified" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useViewerQuery(
  options?: Omit<Urql.UseQueryArgs<ViewerQueryVariables>, "query">,
) {
  return Urql.useQuery<ViewerQuery>({ query: ViewerDocument, ...options })
}
export const SitePageQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SitePageQuery" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "domainOrSubdomain" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "slugOrId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "site" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "domainOrSubdomain" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "domainOrSubdomain" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "page" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "slugOrId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "slugOrId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "domainOrSubdomain" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "domainOrSubdomain" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "type" } },
                { kind: "Field", name: { kind: "Name", value: "permalink" } },
                { kind: "Field", name: { kind: "Name", value: "publishedAt" } },
                { kind: "Field", name: { kind: "Name", value: "contentHTML" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useSitePageQueryQuery(
  options: Omit<Urql.UseQueryArgs<SitePageQueryQueryVariables>, "query">,
) {
  return Urql.useQuery<SitePageQueryQuery>({
    query: SitePageQueryDocument,
    ...options,
  })
}
export const SiteArchivesPageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SiteArchivesPage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "domainOrSubdomain" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "site" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "domainOrSubdomain" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "domainOrSubdomain" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "posts" },
                  name: { kind: "Name", value: "pages" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "visibility" },
                      value: { kind: "EnumValue", value: "PUBLISHED" },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "title" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "slug" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "publishedAt" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useSiteArchivesPageQuery(
  options: Omit<Urql.UseQueryArgs<SiteArchivesPageQueryVariables>, "query">,
) {
  return Urql.useQuery<SiteArchivesPageQuery>({
    query: SiteArchivesPageDocument,
    ...options,
  })
}
export const SiteIndexPageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SiteIndexPage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "domainOrSubdomain" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "site" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "domainOrSubdomain" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "domainOrSubdomain" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "posts" },
                  name: { kind: "Name", value: "pages" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "visibility" },
                      value: { kind: "EnumValue", value: "PUBLISHED" },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "title" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "permalink" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "publishedAt" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "autoExcerpt" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useSiteIndexPageQuery(
  options: Omit<Urql.UseQueryArgs<SiteIndexPageQueryVariables>, "query">,
) {
  return Urql.useQuery<SiteIndexPageQuery>({
    query: SiteIndexPageDocument,
    ...options,
  })
}
export const SubdomainIndexDataDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SubdomainIndexData" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "domainOrSubdomain" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "site" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "domainOrSubdomain" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "domainOrSubdomain" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "subdomain" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "stats" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "postCount" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "subscriberCount" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useSubdomainIndexDataQuery(
  options: Omit<Urql.UseQueryArgs<SubdomainIndexDataQueryVariables>, "query">,
) {
  return Urql.useQuery<SubdomainIndexDataQuery>({
    query: SubdomainIndexDataDocument,
    ...options,
  })
}
export const NewSiteDataDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "NewSiteData" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "viewer" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

export function useNewSiteDataQuery(
  options?: Omit<Urql.UseQueryArgs<NewSiteDataQueryVariables>, "query">,
) {
  return Urql.useQuery<NewSiteDataQuery>({
    query: NewSiteDataDocument,
    ...options,
  })
}
