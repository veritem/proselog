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

export type Mutation = {
  __typename?: "Mutation"
  createPost: Post
  createSite: Site
  deletePost: Scalars["Boolean"]
  deleteSite: Scalars["Boolean"]
  requestLoginLink: Scalars["Boolean"]
  updatePost: Post
  updateSite: Site
  updateViewerEmail: Viewer
  updateViewerProfile: Viewer
}

export type MutationCreatePostArgs = {
  content: Scalars["String"]
  siteId: Scalars["String"]
  title: Scalars["String"]
}

export type MutationCreateSiteArgs = {
  name: Scalars["String"]
  subdomain: Scalars["String"]
}

export type MutationDeleteSiteArgs = {
  id: Scalars["String"]
}

export type MutationRequestLoginLinkArgs = {
  email: Scalars["String"]
}

export type MutationUpdatePostArgs = {
  content?: InputMaybe<Scalars["String"]>
  id: Scalars["String"]
  title?: InputMaybe<Scalars["String"]>
}

export type MutationUpdateSiteArgs = {
  id: Scalars["String"]
  name?: InputMaybe<Scalars["String"]>
  subdomain?: InputMaybe<Scalars["String"]>
}

export type MutationUpdateViewerEmailArgs = {
  email: Scalars["String"]
  userId: Scalars["String"]
}

export type MutationUpdateViewerProfileArgs = {
  avatar?: InputMaybe<Scalars["String"]>
  name?: InputMaybe<Scalars["String"]>
  userId: Scalars["String"]
}

export type Pagination = {
  __typename?: "Pagination"
  hasMore: Scalars["Boolean"]
  total: Scalars["Int"]
}

export type Post = {
  __typename?: "Post"
  content: Scalars["String"]
  createdAt: Scalars["DateTime"]
  id: Scalars["String"]
  published: Scalars["Boolean"]
  publishedAt: Scalars["DateTime"]
  site: Site
  siteId: Scalars["String"]
  title: Scalars["String"]
  updatedAt: Scalars["DateTime"]
}

export type PostsConnection = {
  __typename?: "PostsConnection"
  nodes: Array<Post>
  pagination: Pagination
}

export type Query = {
  __typename?: "Query"
  postBySlug: Post
  site: Site
  viewer?: Maybe<Viewer>
}

export type QueryPostBySlugArgs = {
  slug: Scalars["String"]
}

export type QuerySiteArgs = {
  domain: Scalars["String"]
}

export type Site = {
  __typename?: "Site"
  createdAt: Scalars["DateTime"]
  id: Scalars["String"]
  name: Scalars["String"]
  posts: PostsConnection
  subdomain: Scalars["String"]
  updatedAt: Scalars["DateTime"]
}

export type SitePostsArgs = {
  cursor?: InputMaybe<Scalars["String"]>
  includeDrafts?: InputMaybe<Scalars["Boolean"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type Viewer = {
  __typename?: "Viewer"
  avatar?: Maybe<Scalars["String"]>
  createdAt: Scalars["DateTime"]
  email: Scalars["String"]
  emailVerified?: Maybe<Scalars["String"]>
  id: Scalars["String"]
  name: Scalars["String"]
  siteBySubdomain?: Maybe<Site>
  sites: Array<Site>
  updatedAt: Scalars["DateTime"]
}

export type ViewerSiteBySubdomainArgs = {
  subdomain: Scalars["String"]
}

export type CreatePostMutationVariables = Exact<{
  siteId: Scalars["String"]
  title: Scalars["String"]
  content: Scalars["String"]
}>

export type CreatePostMutation = {
  __typename?: "Mutation"
  createPost: { __typename?: "Post"; id: string }
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

export type RequestLoginLinkMutationVariables = Exact<{
  email: Scalars["String"]
}>

export type RequestLoginLinkMutation = {
  __typename?: "Mutation"
  requestLoginLink: boolean
}

export type SiteBySubdomainQueryVariables = Exact<{
  subdomain: Scalars["String"]
}>

export type SiteBySubdomainQuery = {
  __typename?: "Query"
  viewer?: {
    __typename?: "Viewer"
    siteBySubdomain?: { __typename?: "Site"; id: string } | null
  } | null
}

export const CreatePostDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "createPost" },
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
            name: { kind: "Name", value: "title" },
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
            name: { kind: "Name", value: "content" },
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
            name: { kind: "Name", value: "createPost" },
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

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(
    CreatePostDocument,
  )
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
export const SiteBySubdomainDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "siteBySubdomain" },
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
            name: { kind: "Name", value: "viewer" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "siteBySubdomain" },
                  arguments: [
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

export function useSiteBySubdomainQuery(
  options: Omit<Urql.UseQueryArgs<SiteBySubdomainQueryVariables>, "query">,
) {
  return Urql.useQuery<SiteBySubdomainQuery>({
    query: SiteBySubdomainDocument,
    ...options,
  })
}
