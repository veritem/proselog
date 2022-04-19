import cors from "cors"

export const corsMiddleware = () => {
  return cors({
    credentials: false,
    origin: "*",
  })
}
