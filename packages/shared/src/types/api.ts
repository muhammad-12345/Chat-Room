import { z } from 'zod'

// Generic API Response
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
})

export type ApiResponse<T = any> = {
  success: boolean
  message?: string
  data?: T
  error?: string
}

// Auth API Responses
export const AuthResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    user: z.object({
      _id: z.string(),
      email: z.string(),
      displayName: z.string(),
    }),
    token: z.string(),
  }),
})

export type AuthResponse = z.infer<typeof AuthResponseSchema>

// Room API Responses
export const RoomsListResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    rooms: z.array(z.object({
      _id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      isPrivate: z.boolean(),
      status: z.enum(['inactive', 'live']),
      participantCount: z.number(),
      maxParticipants: z.number(),
      createdAt: z.date(),
    })),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  }),
})

export const RoomResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    room: z.object({
      _id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      isPrivate: z.boolean(),
      status: z.enum(['inactive', 'live']),
      creatorId: z.string(),
      participantCount: z.number(),
      maxParticipants: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  }),
})

// Messages API Response
export const MessagesResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    messages: z.array(z.object({
      _id: z.string(),
      roomId: z.string(),
      userId: z.string(),
      content: z.string(),
      type: z.enum(['text', 'system']),
      createdAt: z.date(),
      user: z.object({
        _id: z.string(),
        displayName: z.string(),
      }),
    })),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  }),
})

// Error Response
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string().optional(),
})

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>

// Pagination
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type Pagination = z.infer<typeof PaginationSchema>

// Query parameters
export const RoomsQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
  isPrivate: z.boolean().optional(),
  status: z.enum(['inactive', 'live']).optional(),
})

export const MessagesQuerySchema = PaginationSchema.extend({
  before: z.string().optional(), // Message ID for cursor-based pagination
  after: z.string().optional(),
})

export type RoomsQuery = z.infer<typeof RoomsQuerySchema>
export type MessagesQuery = z.infer<typeof MessagesQuerySchema>
