import { z } from 'zod'

// Message Schema
export const MessageSchema = z.object({
  _id: z.string(),
  roomId: z.string(),
  userId: z.string(),
  content: z.string().min(1).max(1000),
  type: z.enum(['text', 'system']),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateMessageSchema = z.object({
  roomId: z.string(),
  content: z.string().min(1).max(1000),
  type: z.enum(['text', 'system']).default('text'),
})

// Type exports
export type Message = z.infer<typeof MessageSchema>
export type CreateMessage = z.infer<typeof CreateMessageSchema>

// Message with user info
export const MessageWithUserSchema = MessageSchema.extend({
  user: z.object({
    _id: z.string(),
    displayName: z.string(),
  }),
})

export type MessageWithUser = z.infer<typeof MessageWithUserSchema>
