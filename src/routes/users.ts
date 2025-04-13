import { Router } from "express";
import { UserModel } from "../models/User";
import { UserController } from "../controllers/users";
import { requireAuth } from "../middlewares/auth";

export const createUserRouter = () => {
    const usersRouter = Router()

    const userController = new UserController({ model: UserModel })

    usersRouter.get("/", (req, res) => {
        const { user } = req.session
        if (!user) {
            res.status(401).send('Access denied')
            return
        }
        res.send("Get all users")
    })

    usersRouter.get("/me", requireAuth, (req, res) => {
        const { user } = req.session
        return userController.getCurrentUser(req, res, user?.id)
    })

    usersRouter.get("/:id", userController.getUser)

    usersRouter.patch("/:id", userController.update)

    usersRouter.patch("/change-password/:id", userController.changePassword)

    usersRouter.delete("/:id", (_req, res) => {
        res.send("Delete a user")
    })

    return usersRouter
}
