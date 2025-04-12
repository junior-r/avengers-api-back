import { z } from "zod";

export const userSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6).max(20),
    passwordConfirm: z.string().min(6).max(20),
    name: z.string().min(2).max(20),
    lastName: z.string().min(2).max(20)
})

export const userLoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6).max(20)
})

export const userUpdateSchema = z.object({
    name: z.string().min(2).max(20),
    lastName: z.string().min(2).max(20)
})

export type User = z.infer<typeof userSchema>
export type UserUpdate = z.infer<typeof userUpdateSchema>

export const validateUser = (user: User) => {
    return userSchema.safeParse(user)
}

export const validateUserLogin = (user: User) => {
    return userLoginSchema.safeParse(user)
}

export const validatePartialUser = (data: UserUpdate) => {
    return userUpdateSchema.partial().safeParse(data)
}
