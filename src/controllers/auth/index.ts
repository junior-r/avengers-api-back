import { Request, Response } from "express"
import { AuthModel } from "../../models/Auth"
import { validateUser, validateUserLogin } from "../../schemas/users"
import { config } from '../../config'
import jwt from 'jsonwebtoken'

const { SECRET_JWT_KEY, SECRET_REFRESH_KEY, COOKIE_OPTIONS } = config

export class AuthController {
    private model: typeof AuthModel

    constructor({ model }: { model: typeof AuthModel }) {
        this.model = model
    }

    login = async (req: Request, res: Response) => {
        const result = validateUserLogin(req.body)

        if (!result.success || !result.data) {
            res.status(400).json({ error: JSON.parse(result.error.message) })
            return
        }

        const { email, password } = result.data

        try {
            const user = await this.model.loginByEmail({ email, checkPassword: password })
            const token = await jwt.sign({ id: user.id, email: user.email }, SECRET_JWT_KEY, { expiresIn: "1d" })
            const refreshToken = await jwt.sign({ id: user.id, email: user.email }, SECRET_REFRESH_KEY, { expiresIn: "7d" })

            res.cookie('access_token', token, {
                ...COOKIE_OPTIONS,
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            }).cookie('refresh_token', refreshToken, {
                ...COOKIE_OPTIONS,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            }).status(200).send(user)
        } catch (_error) {
            res.status(401).send("Invalid credentials")
        }
    }

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = validateUser(req.body)

            if (!result.success || !result.data) {
                res.status(400).json({ error: JSON.parse(result.error.message) })
                return
            }

            const { password, passwordConfirm } = result.data

            if (password !== passwordConfirm) {
                res.status(400).json({ error: "Passwords do not match" })
                return
            }

            const newUser = await this.model.create({ data: result.data })
            res.status(201).json(newUser)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message })
                return
            }
            res.status(500).json({ error: "Internal server error" })
        }
        return
    }
}