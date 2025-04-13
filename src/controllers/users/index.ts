import { UserModel } from "../../models/User"
import { Request, Response } from "express"
import { validateChangePassword, validatePartialUser } from "../../schemas/users"
import { logoutUser } from "../../utils/logoutUser"


export class UserController {
    private model: typeof UserModel

    constructor({ model }: { model: typeof UserModel }) {
        this.model = model
    }

    getUser = async (req: Request, res: Response) => {
        const id = req.params.id

        try {
            const user = await this.model.getById({ id })
            res.send(user)
        } catch (error) {
            res.status(401).send("Error getting user")
        }
    }

    getCurrentUser = async (_req: Request, res: Response, id: string) => {
        try {
            const user = await this.model.getById({ id })
            res.send(user)
        } catch (error) {
            res.status(401).send("Error getting user")
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const user = req.body
            const result = validatePartialUser(user)
            if (!result.success) {
                res.status(400).json({ error: JSON.parse(result.error.message) })
                return
            }

            const { id } = req.params
            const updatedUser = await this.model.update({ id, data: result.data })
            if (!updatedUser) {
                res.status(404).json({ message: "User not found" })
                return
            }

            res.status(200).json(updatedUser)
        } catch (error) {
            res.status(401).send("Error getting user")
        }
    }

    changePassword = async (req: Request, res: Response) => {
        try {
            const data = req.body
            const result = validateChangePassword(data)
            if (!result.success) {
                res.status(400).json({ error: JSON.parse(result.error.message) })
                return
            }

            const { currentPassword, password, passwordConfirm } = result.data

            if (password !== passwordConfirm) {
                res.status(400).json({ error: "Passwords do not match" })
                return
            }

            if (currentPassword === password) {
                res.status(400).json({ error: "The new password must be different from the old one" })
                return
            }

            const { id } = req.params
            const changedData = await this.model.changePassword({ id, data: result.data })
            if (!changedData) {
                res.status(400).json({ message: "Cannot change password" })
            }

            logoutUser(req, res, "Password changed successfully.")
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ error: error.message })
                return
            }
            res.status(400).json({ error: "Error to update user password" })
            return
        }
    }
}