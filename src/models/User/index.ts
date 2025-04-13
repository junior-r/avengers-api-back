import { PrismaClient } from "@prisma/client"
import { UserChangePassword, UserUpdate } from "../../schemas/users"
import bcrypt from "bcryptjs"
import { config } from '../../config'

const { SALT_ROUNDS } = config


const prisma = new PrismaClient()

export class UserModel {
    static async getById({ id }: { id: string }) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: id
                },
                omit: {
                    password: true
                }
            })
            if (!user) {
                throw new Error("User not found")
            }
            return user
        } catch (_error) {
            throw new Error("Error getting user by id")
        }
    }

    static async update({ id, data }: { id: string, data: Partial<UserUpdate> }) {
        const newData = Object.entries(data).reduce((acc, [key, value]) => {
            if (value !== undefined) acc[key] = value
            return acc
        }, {} as Record<string, unknown>)

        try {
            const user = await prisma.user.update({
                where: { id: id },
                data: newData,
                omit: { password: true }
            })
            return user
        } catch (error) {
            throw new Error("Error at update user")
        }
    }

    static async changePassword({ id, data }: { id: string, data: UserChangePassword }) {
        try {
            const user = await prisma.user.findUnique({
                where: { id }
            })
            if (!user) {
                throw new Error("User not found")
            }

            const isValidPassword = await bcrypt.compare(data.currentPassword, user.password)
            if (!isValidPassword) {
                throw new Error("Invalid password")
            }

            const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)
            const userChanged = await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
                omit: { password: true }
            })
            if (!userChanged) {
                throw new Error("User not found")
            }

            return userChanged
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message)
            } else {
                throw new Error("Error at update user")
            }
        }
    }
}