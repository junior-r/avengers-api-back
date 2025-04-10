import dotenv from 'dotenv'

dotenv.config()

interface Config {
    PORT: string | number
    SALT_ROUNDS: string | number
    SECRET_JWT_KEY: string,
    SECRET_REFRESH_KEY: string,
    COOKIE_OPTIONS: {
        httpOnly: boolean,
        sameSite: boolean | "lax" | "none" | "strict" | undefined,
        secure: boolean
    }
}

export const config: Config = {
    PORT: process.env.PORT || 3000,
    SALT_ROUNDS: process.env.SALT_ROUNDS || 10,
    SECRET_JWT_KEY: process.env.SECRET_JWT_KEY as string,
    SECRET_REFRESH_KEY: process.env.SECRET_REFRESH_KEY as string,
    COOKIE_OPTIONS: {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    }
}