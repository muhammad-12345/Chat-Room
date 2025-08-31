import { Request, Response } from 'express'

import { RoomModel } from '../models/Room'
import { AuthenticatedRequest } from '../utils/auth'
import {
  HTTP_STATUS,
  ERROR_CODES,
  CreateRoomSchema,
  UpdateRoomSchema,
  RoomStatus,
} from '@chat-room/shared'
import logger from '../utils/logger'

/**
 * Get list of public rooms
 */
export async function getRooms(req: Request, res: Response): Promise<void> {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const query: any = { isPrivate: false }

    // Add search filter
    if (search) {
      query.$text = { $search: search as string }
    }

    // Add status filter
    if (status) {
      query.status = status
    }

    // Build sort object
    const sort: any = {}
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1

    const [rooms, total] = await Promise.all([
      RoomModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate('creatorId', 'displayName'),
      RoomModel.countDocuments(query),
    ])

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        rooms: rooms.map(room => ({
          ...room.toJSON(),
          creator: (room as any).creatorId,
        })),
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    logger.error('Get rooms error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to get rooms',
    })
  }
}

/**
 * Get room by ID
 */
export async function getRoomById(req: Request, res: Response): Promise<void> {
  try {
    const { roomId } = req.params

    const room = await RoomModel.findById(roomId).populate('creatorId', 'displayName')

    if (!room) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: ERROR_CODES.ROOM_NOT_FOUND,
        message: 'Room not found',
      })
      return
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        room: {
          ...room.toJSON(),
          creator: (room as any).creatorId,
        },
      },
    })
  } catch (error) {
    logger.error('Get room by ID error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to get room',
    })
  }
}

/**
 * Create a new room
 */
export async function createRoom(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user!
    const { name, description, isPrivate, accessCode, maxParticipants } = req.body

    const roomData: any = {
      name,
      description,
      isPrivate,
      creatorId: user._id,
      maxParticipants,
      status: RoomStatus.INACTIVE,
    }

    // Hash access code if provided
    if (isPrivate && accessCode) {
      roomData.accessCodeHash = accessCode // Will be hashed by pre-save middleware
    }

    const room = new RoomModel(roomData)
    await room.save()

    // Populate creator info
    await room.populate('creatorId', 'displayName')

    logger.info('Room created successfully', {
      roomId: room._id,
      creatorId: user._id,
      isPrivate,
    })

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: {
        room: {
          ...room.toJSON(),
          creator: (room as any).creatorId,
        },
      },
      message: 'Room created successfully',
    })
  } catch (error) {
    logger.error('Create room error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to create room',
    })
  }
}

/**
 * Update room (creator only)
 */
export async function updateRoom(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user!
    const { roomId } = req.params
    const updates = req.body

    const room = await RoomModel.findById(roomId)

    if (!room) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: ERROR_CODES.ROOM_NOT_FOUND,
        message: 'Room not found',
      })
      return
    }

    // Check if user is the creator
    if (room.creatorId.toString() !== user._id.toString()) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: ERROR_CODES.NOT_ROOM_CREATOR,
        message: 'Only the room creator can update the room',
      })
      return
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      if (key === 'accessCode' && updates[key]) {
        room.accessCodeHash = updates[key] // Will be hashed by pre-update middleware
      } else if (key !== 'accessCode') {
        ;(room as any)[key] = updates[key]
      }
    })

    await room.save()
    await room.populate('creatorId', 'displayName')

    logger.info('Room updated successfully', {
      roomId: room._id,
      updatedBy: user._id,
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        room: {
          ...room.toJSON(),
          creator: (room as any).creatorId,
        },
      },
      message: 'Room updated successfully',
    })
  } catch (error) {
    logger.error('Update room error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to update room',
    })
  }
}

/**
 * Delete room (creator only)
 */
export async function deleteRoom(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user!
    const { roomId } = req.params

    const room = await RoomModel.findById(roomId)

    if (!room) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: ERROR_CODES.ROOM_NOT_FOUND,
        message: 'Room not found',
      })
      return
    }

    // Check if user is the creator
    if (room.creatorId.toString() !== user._id.toString()) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: ERROR_CODES.NOT_ROOM_CREATOR,
        message: 'Only the room creator can delete the room',
      })
      return
    }

    await RoomModel.findByIdAndDelete(roomId)

    logger.info('Room deleted successfully', {
      roomId: room._id,
      deletedBy: user._id,
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Room deleted successfully',
    })
  } catch (error) {
    logger.error('Delete room error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to delete room',
    })
  }
}

/**
 * Set room status (creator only)
 */
export async function setRoomStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user!
    const { roomId } = req.params
    const { status } = req.body

    const room = await RoomModel.findById(roomId)

    if (!room) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: ERROR_CODES.ROOM_NOT_FOUND,
        message: 'Room not found',
      })
      return
    }

    // Check if user is the creator
    if (room.creatorId.toString() !== user._id.toString()) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: ERROR_CODES.NOT_ROOM_CREATOR,
        message: 'Only the room creator can change room status',
      })
      return
    }

    room.status = status
    await room.save()

    logger.info('Room status updated successfully', {
      roomId: room._id,
      status,
      updatedBy: user._id,
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        room: {
          _id: room._id,
          status: room.status,
        },
      },
      message: 'Room status updated successfully',
    })
  } catch (error) {
    logger.error('Set room status error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to update room status',
    })
  }
}

/**
 * Join room attempt
 */
export async function joinRoom(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user!
    const { roomId } = req.params
    const { accessCode } = req.body

    const room = await RoomModel.findById(roomId).select('+accessCodeHash')

    if (!room) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: ERROR_CODES.ROOM_NOT_FOUND,
        message: 'Room not found',
      })
      return
    }

    // Check if room is private and access code is required
    if (room.isPrivate && room.accessCodeHash) {
      if (!accessCode) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: ERROR_CODES.INVALID_ACCESS_CODE,
          message: 'Access code is required for private rooms',
        })
        return
      }

      const isAccessCodeValid = await room.compareAccessCode(accessCode)
      if (!isAccessCodeValid) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: ERROR_CODES.INVALID_ACCESS_CODE,
          message: 'Invalid access code',
        })
        return
      }
    }

    // Check if room is full
    if (room.participantCount >= room.maxParticipants) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_CODES.ROOM_FULL,
        message: 'Room is full',
      })
      return
    }

    // Return room status and join instructions
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        room: {
          _id: room._id,
          name: room.name,
          status: room.status,
          participantCount: room.participantCount,
          maxParticipants: room.maxParticipants,
        },
        canJoin: true,
        needsLobby: room.status === RoomStatus.INACTIVE,
      },
      message: room.status === RoomStatus.LIVE 
        ? 'You can join the room'
        : 'Room is inactive, you will be placed in lobby',
    })
  } catch (error) {
    logger.error('Join room error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to join room',
    })
  }
}

/**
 * Get user's created rooms
 */
export async function getMyRooms(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user!

    const rooms = await RoomModel.findByCreator(user._id.toString())

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        rooms: rooms.map(room => ({
          ...room.toJSON(),
          creator: (room as any).creatorId,
        })),
      },
    })
  } catch (error) {
    logger.error('Get my rooms error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to get your rooms',
    })
  }
}
