import { PrismaClient } from "@prisma/client"
import { UserUpdate } from "../../schemas/users"


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
}