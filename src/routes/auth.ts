import { Router } from "express";
import { AuthController } from "../controllers/auth";
import { AuthModel } from "../models/Auth";
import { config } from "../config";

const { COOKIE_OPTIONS } = config

export const createAuthRouter = () => {
    const authRouter = Router()
    const authController = new AuthController({ model: AuthModel })

    authRouter.get("/", (_req, res) => {
        res.send("Auth route")
    })

    authRouter.post("/login", authController.login)

    authRouter.post("/register", authController.create)

    authRouter.post("/logout", (_req, res) => {
        res
            .clearCookie('access_token', COOKIE_OPTIONS)
            .clearCookie('refresh_token', COOKIE_OPTIONS)
            .json({ message: 'Logout successful' })
    })
    return authRouter
}
