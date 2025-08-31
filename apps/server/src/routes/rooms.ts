import { Router } from 'express'
import { z } from 'zod'

import * as roomController from '../controllers/roomController'
import { validate, asyncHandler } from '../middleware/validation'
import { authenticate } from '../utils/auth'
import { CreateRoomSchema, UpdateRoomSchema, RoomsQuerySchema } from '@chat-room/shared'

const router = Router()

// Room ID parameter validation
const roomIdSchema = z.object({
  roomId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid room ID'),
})

// Join room schema
const joinRoomSchema = z.object({
  accessCode: z.string().optional(),
})

// Set status schema
const setStatusSchema = z.object({
  status: z.enum(['inactive', 'live']),
})

// Public routes
router.get(
  '/',
  validate({ query: RoomsQuerySchema }),
  asyncHandler(roomController.getRooms)
)

router.get(
  '/:roomId',
  validate({ params: roomIdSchema }),
  asyncHandler(roomController.getRoomById)
)

// Protected routes
router.use(authenticate) // All routes below require authentication

router.post(
  '/',
  validate({ body: CreateRoomSchema }),
  asyncHandler(roomController.createRoom)
)

router.get(
  '/my/created',
  asyncHandler(roomController.getMyRooms)
)

router.put(
  '/:roomId',
  validate({ 
    params: roomIdSchema,
    body: UpdateRoomSchema,
  }),
  asyncHandler(roomController.updateRoom)
)

router.delete(
  '/:roomId',
  validate({ params: roomIdSchema }),
  asyncHandler(roomController.deleteRoom)
)

router.post(
  '/:roomId/join',
  validate({ 
    params: roomIdSchema,
    body: joinRoomSchema,
  }),
  asyncHandler(roomController.joinRoom)
)

router.post(
  '/:roomId/status',
  validate({ 
    params: roomIdSchema,
    body: setStatusSchema,
  }),
  asyncHandler(roomController.setRoomStatus)
)

export default router
