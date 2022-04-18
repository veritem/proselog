import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      $src: path.resolve("./src"),
      $server: path.resolve("./server"),
    },
  },
  test: {
    globalSetup: ["./scripts/vitest-global.ts"],
    testTimeout: 50000,
  },
})
