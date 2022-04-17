import cors from "cors"

const isProd = process.env.NODE_ENV === "production"

export const corsMiddleware = () => {
  return cors({
    credentials: !isProd,
    origin: isProd
      ? ["*"]
      : ["https://studio.apollographql.com", "http://localhost:3000"],
  })
}
