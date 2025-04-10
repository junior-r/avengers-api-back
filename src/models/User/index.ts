import { PrismaClient, User } from "@prisma/client"


const prisma = new PrismaClient()

const returnUserInfo = (user: User) => {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        isMod: user.isMod,
        isAdmin: user.isAdmin,
        isActive: user.isActive
    }
}

export class UserModel {
    static async getById({ id }: { id: string }) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: id
                }
            })
            if (!user) {
                throw new Error("User not found")
            }
            return returnUserInfo(user)
        } catch (_error) {
            throw new Error("Error getting user by id")
        }
    }
}