declare namespace NodeJS {
  interface ProcessEnv {
    // Additional environment variables
    NEXT_PUBLIC_APP_NAME: string
    DATABASE_URL: string
    AUTH_COOKIE_NAME: string
    AUTH_SECRET: string
    NEXT_PUBLIC_OUR_DOMAIN: string
    S3_REGION: string
    S3_ACCESS_KEY_ID: string
    S3_SECRET_ACCESS_KEY: string
    S3_BUCKET_NAME: string
    S3_ENDPOINT?: string
    MAILGUN_APIKEY: string
    MAILGUN_DOMAIN: string
  }
}

type $TsFixMe = any

declare namespace Express {
  interface User {
    id: number
  }
}

declare var _singletons: Record<string, any>
