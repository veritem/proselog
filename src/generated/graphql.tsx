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
  updateUserProfile: User
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
  published?: InputMaybe<Scalars["Boolean"]>
  publishedAt?: InputMaybe<Scalars["DateTime"]>
  title?: InputMaybe<Scalars["String"]>
}

export type MutationUpdateSiteArgs = {
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
  slug: Scalars["String"]
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
  post: Post
  site: Site
  user?: Maybe<User>
  viewer?: Maybe<User>
}

export type QueryPostArgs = {
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
  id: Scalars["String"]
  name: Scalars["String"]
  posts: PostsConnection
  subdomain: Scalars["String"]
  updatedAt: Scalars["DateTime"]
  user: User
  userId: Scalars["String"]
}

export type SitePostsArgs = {
  cursor?: InputMaybe<Scalars["String"]>
  includeDrafts?: InputMaybe<Scalars["Boolean"]>
  take?: InputMaybe<Scalars["Int"]>
}

export type User = {
  __typename?: "User"
  avatar?: Maybe<Scalars["String"]>
  createdAt: Scalars["DateTime"]
  email: Scalars["String"]
  emailVerified?: Maybe<Scalars["Boolean"]>
  id: Scalars["String"]
  name: Scalars["String"]
  site: Site
  sites: Array<Site>
  updatedAt: Scalars["DateTime"]
  username: Scalars["String"]
}

export type UserSiteArgs = {
  domainOrSubdomain: Scalars["String"]
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

export type PostForEditQueryVariables = Exact<{
  slugOrId: Scalars["String"]
}>

export type PostForEditQuery = {
  __typename?: "Query"
  post: {
    __typename?: "Post"
    id: string
    slug: string
    title: string
    content: string
    publishedAt: any
    published: boolean
  }
}

export type PostsForDashboardQueryVariables = Exact<{
  domainOrSubdomain: Scalars["String"]
  includeDrafts?: InputMaybe<Scalars["Boolean"]>
}>

export type PostsForDashboardQuery = {
  __typename?: "Query"
  site: {
    __typename?: "Site"
    id: string
    posts: {
      __typename?: "PostsConnection"
      nodes: Array<{
        __typename?: "Post"
        id: string
        title: string
        content: string
        publishedAt: any
        published: boolean
      }>
    }
  }
}

export type RequestLoginLinkMutationVariables = Exact<{
  email: Scalars["String"]
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
  site: { __typename?: "Site"; id: string; name: string; subdomain: string }
}

export type UpdatePostMutationVariables = Exact<{
  id: Scalars["String"]
  title?: InputMaybe<Scalars["String"]>
  content?: InputMaybe<Scalars["String"]>
  published?: InputMaybe<Scalars["Boolean"]>
  publishedAt?: InputMaybe<Scalars["DateTime"]>
}>

export type UpdatePostMutation = {
  __typename?: "Mutation"
  updatePost: { __typename?: "Post"; id: string }
}

export type UpdateSiteMutationVariables = Exact<{
  id: Scalars["String"]
  name?: InputMaybe<Scalars["String"]>
  subdomain?: InputMaybe<Scalars["String"]>
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
export const PostForEditDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "postForEdit" },
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
            name: { kind: "Name", value: "post" },
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

export function usePostForEditQuery(
  options: Omit<Urql.UseQueryArgs<PostForEditQueryVariables>, "query">,
) {
  return Urql.useQuery<PostForEditQuery>({
    query: PostForEditDocument,
    ...options,
  })
}
export const PostsForDashboardDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "postsForDashboard" },
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
            name: { kind: "Name", value: "includeDrafts" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
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
                  name: { kind: "Name", value: "posts" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "includeDrafts" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "includeDrafts" },
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

export function usePostsForDashboardQuery(
  options: Omit<Urql.UseQueryArgs<PostsForDashboardQueryVariables>, "query">,
) {
  return Urql.useQuery<PostsForDashboardQuery>({
    query: PostsForDashboardDocument,
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
                { kind: "Field", name: { kind: "Name", value: "subdomain" } },
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
export const UpdatePostDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "updatePost" },
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
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updatePost" },
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

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(
    UpdatePostDocument,
  )
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
