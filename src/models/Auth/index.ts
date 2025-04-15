import { Prisma, PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { config } from '../../config'
import { User as CustomUserType } from '../../schemas/users'

const { SALT_ROUNDS } = config

const prisma = new PrismaClient()

const returnUserInfo = (user: User) => {
	return {
		id: user.id,
		email: user.email,
		name: user.name,
		lastName: user.lastName,
		isMod: user.isMod,
		isAdmin: user.isAdmin,
		isActive: user.isActive,
		createdAt: user.createdAt,
	}
}

export class AuthModel {
	static async create({ data }: { data: CustomUserType }) {
		const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)
		try {
			const newUser = await prisma.user.create({
				data: {
					email: data.email,
					password: hashedPassword,
					name: data.name,
					lastName: data.lastName,
				},
			})
			return {
				id: newUser.id,
				email: newUser.email,
			}
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new Error('User already exists')
				}
			}
			throw new Error('Error creating user')
		}
	}

	static async loginByEmail({ email, checkPassword }: { email: string; checkPassword: string }) {
		try {
			const user = await prisma.user.findUnique({
				where: { email },
			})
			if (!user) {
				throw new Error('User not found')
			}

			const isValidPassword = await bcrypt.compare(checkPassword, user.password)
			if (!isValidPassword) {
				throw new Error('Invalid password')
			}

			return returnUserInfo(user)
		} catch (_error) {
			throw new Error('Error getting user by email')
		}
	}
}
