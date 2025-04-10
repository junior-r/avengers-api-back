import { UserModel } from "../../models/User"
import { Request, Response } from "express"


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
}