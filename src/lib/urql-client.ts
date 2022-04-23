import React from "react"
import {
  Client,
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  ssrExchange,
} from "urql"

export const createUrqlClient = ({
  initialState,
  token,
  endpoint,
}: {
  initialState?: any
  token?: string
  endpoint?: string
} = {}) => {
  const ssr = ssrExchange({
    isClient: process.browser,
  })
  ssr.restoreData(initialState)
  const headers: Record<string, string> = {}
  if (token) {
    headers.authorization = `Bearer ${token}`
  }
  const client = createClient({
    url: `${endpoint || ""}/api/graphql`,
    fetchOptions: {
      credentials: "same-origin",
      headers,
    },
    requestPolicy: "cache-and-network",
    exchanges: [dedupExchange, cacheExchange, ssr, fetchExchange],
  })
  return { client, ssr }
}

let urqlClient: Client | undefined

const initializeUrqlClient = (initialState: Record<string, any>) => {
  const client = urqlClient ?? createUrqlClient({ initialState }).client
  if (!process.browser) {
    return client
  }
  if (!urqlClient) {
    urqlClient = client
  }
  return client
}

export const useUrqlClient = (initialState: Record<string, any>) => {
  return React.useMemo(() => initializeUrqlClient(initialState), [initialState])
}
