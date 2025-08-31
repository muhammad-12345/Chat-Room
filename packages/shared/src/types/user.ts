import { z } from 'zod'

// User Schema
export const UserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  displayName: z.string().min(1).max(50),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  displayName: z.string().min(1).max(50),
})

export const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const UpdateUserSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
})

// Type exports
export type User = z.infer<typeof UserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type LoginUser = z.infer<typeof LoginUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>

// Public user type (without sensitive data)
export const PublicUserSchema = UserSchema.omit({
  email: true,
})

export type PublicUser = z.infer<typeof PublicUserSchema>
