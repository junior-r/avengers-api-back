import { config } from "../config"
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from "express"

const { SECRET_JWT_KEY, SECRET_REFRESH_KEY, COOKIE_OPTIONS } = config
type dataToEncrypt = { id: string, email: string } | null


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token
    const refreshToken = req.cookies.refresh_token

    let data: dataToEncrypt = null
    req.session = { user: null }


    try {
        data = jwt.verify(token, SECRET_JWT_KEY) as dataToEncrypt
        req.session.user = data
        return next()
    } catch (error) {
        if ((error instanceof jwt.TokenExpiredError || jwt.JsonWebTokenError) && refreshToken) {
            try {
                const payload = jwt.verify(refreshToken, SECRET_REFRESH_KEY) as dataToEncrypt
                const newAccessToken = jwt.sign(
                    { id: payload?.id, email: payload?.email },
                    SECRET_JWT_KEY,
                    { expiresIn: "1d" }
                )

                res.cookie("access_token", newAccessToken, {
                    ...COOKIE_OPTIONS,
                    maxAge: 24 * 60 * 60 * 1000 // 1 day
                })

                req.session.user = { id: payload?.id, email: payload?.email }
            } catch (refreshError) {
                // refresh token inválido o expirado
                req.session.user = null
            }
        }
    }
    next()
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return
    }
    next();
}