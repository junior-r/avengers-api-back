import { Router } from "express";
import { AuthController } from "../controllers/auth";
import { AuthModel } from "../models/Auth";

export const createAuthRouter = () => {
    const authRouter = Router()
    const authController = new AuthController({ model: AuthModel })

    authRouter.get("/", (_req, res) => {
        res.send("Auth route")
    })

    authRouter.post("/login", authController.login)

    authRouter.post("/register", authController.create)

    authRouter.post("/logout", authController.logout)

    return authRouter
}
