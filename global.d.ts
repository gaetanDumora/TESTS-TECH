namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string,
        PORT: string,
        SIREN_CLIENT: string,
        SIREN_SECRET: string,
        SIREN_ACCESS_TOKEN: string,
        SIREN_EXPIRES_AT: number
    }
}
