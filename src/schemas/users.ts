import { z } from "zod";

export const userSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6).max(20),
    passwordConfirm: z.string().min(6).max(20),
    name: z.string().min(2).max(20)
})

export const userLoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6).max(20)
})

export type User = z.infer<typeof userSchema>

export const validateUser = (user: User) => {
    return userSchema.safeParse(user)
}

export const validateUserLogin = (user: User) => {
    return userLoginSchema.safeParse(user)
}
