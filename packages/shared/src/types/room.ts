import { z } from 'zod'

// Room Status
export const RoomStatus = {
  INACTIVE: 'inactive',
  LIVE: 'live',
} as const

export const RoomStatusSchema = z.enum(['inactive', 'live'])

// Room Schema
export const RoomSchema = z.object({
  _id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPrivate: z.boolean(),
  status: RoomStatusSchema,
  accessCodeHash: z.string().optional(),
  creatorId: z.string(),
  participantCount: z.number().min(0),
  maxParticipants: z.number().min(1).max(50),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateRoomSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPrivate: z.boolean(),
  accessCode: z.string().min(4).max(20).optional(),
  maxParticipants: z.number().min(1).max(50).default(10),
})

export const JoinRoomSchema = z.object({
  roomId: z.string(),
  accessCode: z.string().optional(),
})

export const UpdateRoomSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  isPrivate: z.boolean().optional(),
  accessCode: z.string().min(4).max(20).optional(),
  maxParticipants: z.number().min(1).max(50).optional(),
})

// Type exports
export type Room = z.infer<typeof RoomSchema>
export type CreateRoom = z.infer<typeof CreateRoomSchema>
export type JoinRoom = z.infer<typeof JoinRoomSchema>
export type UpdateRoom = z.infer<typeof UpdateRoomSchema>
export type RoomStatusType = z.infer<typeof RoomStatusSchema>

// Public room type (without sensitive data)
export const PublicRoomSchema = RoomSchema.omit({
  accessCodeHash: true,
})

export type PublicRoom = z.infer<typeof PublicRoomSchema>
