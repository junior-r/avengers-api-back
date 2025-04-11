import { PrismaClient } from "@prisma/client"


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
}