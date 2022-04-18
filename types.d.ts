declare namespace NodeJS {
  interface ProcessEnv {
    // Additional environment variables
    NEXT_PUBLIC_APP_NAME: string
    GITHUB_CLIENT_ID?: string
    GITHUB_CLIENT_SECRET?: string
    GOOGLE_CLIENT_ID?: string
    GOOGLE_CLIENT_SECRET?: string
    DATABASE_URL: string
    AUTH_COOKIE_NAME: string
    AUTH_COOKIE_DOMAIN?: string
    AUTH_SECRET: string
    OUR_DOMAIN: string
    S3_REGION: string
    S3_ACCESS_KEY_ID: string
    S3_SECRET_ACCESS_KEY: string
    S3_BUCKET_NAME: string
    S3_ENDPOINT?: string
  }
}

type $TsFixMe = any

declare namespace Express {
  interface User {
    id: number
  }
}

declare var _singletons: Record<string, any>
