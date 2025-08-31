import { Request, Response } from 'express'

import { MessageModel } from '../models/Message'
import { RoomModel } from '../models/Room'
import { AuthenticatedRequest } from '../utils/auth'
import { HTTP_STATUS, ERROR_CODES, MessagesQuerySchema } from '@chat-room/shared'
import logger from '../utils/logger'

/**
 * Get messages for a room
 */
export async function getRoomMessages(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user!
    const { roomId } = req.params
    const { page = 1, limit = 50, before } = req.query

    // Check if room exists
    const room = await RoomModel.findById(roomId)
    if (!room) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: ERROR_CODES.ROOM_NOT_FOUND,
        message: 'Room not found',
      })
      return
    }

    // For private rooms, check access (simplified - in real app, check if user is in room)
    if (room.isPrivate && room.creatorId.toString() !== user._id.toString()) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: ERROR_CODES.ROOM_ACCESS_DENIED,
        message: 'Access denied to private room',
      })
      return
    }

    // Get messages
    const messages = await MessageModel.findByRoom(
      roomId,
      Number(limit),
      before as string
    )

    // Reverse to get chronological order (oldest first)
    messages.reverse()

    // Get total count for pagination
    const total = await MessageModel.countDocuments({ roomId })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        messages: messages.map(message => ({
          ...message.toJSON(),
          user: (message as any).userId,
        })),
        total,
        page: Number(page),
        limit: Number(limit),
        hasMore: messages.length === Number(limit),
      },
    })
  } catch (error) {
    logger.error('Get room messages error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to get messages',
    })
  }
}

/**
 * Send a message to a room (fallback HTTP endpoint)
 */
export async function sendMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user!
    const { roomId } = req.params
    const { content } = req.body

    // Check if room exists
    const room = await RoomModel.findById(roomId)
    if (!room) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: ERROR_CODES.ROOM_NOT_FOUND,
        message: 'Room not found',
      })
      return
    }

    // Create message
    const message = new MessageModel({
      roomId,
      userId: user._id,
      content,
      type: 'text',
    })

    await message.save()
    await message.populate('userId', 'displayName')

    logger.info('Message sent via HTTP', {
      messageId: message._id,
      roomId,
      userId: user._id,
    })

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: {
        message: {
          ...message.toJSON(),
          user: (message as any).userId,
        },
      },
      message: 'Message sent successfully',
    })
  } catch (error) {
    logger.error('Send message error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to send message',
    })
  }
}
