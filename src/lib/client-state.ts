import { proxy } from "valtio"

/**
 * never mutate clientState in ssr
 */
export const clientState = proxy({
  loginModalOpened: false,
})
