import { API_ENDPOINT } from "$src/config"
import React from "react"
import {
  Client,
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  ssrExchange,
} from "urql"

export const createUrqlClient = () => {
  const ssr = ssrExchange({
    isClient: process.browser,
  })
  return createClient({
    url: `${API_ENDPOINT}/api/graphql`,
    fetchOptions: {
      credentials: "include",
    },
    requestPolicy: "cache-and-network",
    exchanges: [dedupExchange, cacheExchange, ssr, fetchExchange],
  })
}

let urqlClient: Client | undefined

const initializeUrqlClient = () => {
  const client = urqlClient ?? createUrqlClient()
  if (!process.browser) {
    return client
  }
  if (!urqlClient) {
    urqlClient = client
  }
  return client
}

export const useUrqlClient = () => {
  return React.useMemo(() => initializeUrqlClient(), [])
}
