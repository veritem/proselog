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

const API_URL = `${API_ENDPOINT}/api/graphql`

export const createUrqlClient = (initialState?: any) => {
  const ssr = ssrExchange({
    isClient: process.browser,
  })
  ssr.restoreData(initialState)
  const client = createClient({
    url: API_URL,
    fetchOptions: {
      credentials: "same-origin",
    },
    requestPolicy: "cache-and-network",
    exchanges: [dedupExchange, cacheExchange, ssr, fetchExchange],
  })
  return { client, ssr }
}

let urqlClient: Client | undefined

const initializeUrqlClient = (initialState: any) => {
  const client = urqlClient ?? createUrqlClient(initialState).client
  if (!process.browser) {
    return client
  }
  if (!urqlClient) {
    urqlClient = client
  }
  return client
}

export const useUrqlClient = (initialState: any) => {
  return React.useMemo(() => initializeUrqlClient(initialState), [initialState])
}
