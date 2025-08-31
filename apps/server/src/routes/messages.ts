import { Router } from 'express'
import { z } from 'zod'

import * as messageController from '../controllers/messageController'
import { validate, asyncHandler } from '../middleware/validation'
import { authenticate } from '../utils/auth'
import { messageRateLimit } from '../middleware/rateLimiting'
import { MessagesQuerySchema } from '@chat-room/shared'

const router = Router()

// All message routes require authentication
router.use(authenticate)

// Room ID parameter validation
const roomIdSchema = z.object({
  roomId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid room ID'),
})

// Send message schema
const sendMessageSchema = z.object({
  content: z.string().min(1).max(1000).trim(),
})

// Get messages for a room
router.get(
  '/:roomId',
  validate({ 
    params: roomIdSchema,
    query: MessagesQuerySchema,
  }),
  asyncHandler(messageController.getRoomMessages)
)

// Send message to a room (HTTP fallback)
router.post(
  '/:roomId',
  messageRateLimit,
  validate({ 
    params: roomIdSchema,
    body: sendMessageSchema,
  }),
  asyncHandler(messageController.sendMessage)
)

export default router
