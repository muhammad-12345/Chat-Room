import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'

import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from '@chat-room/shared'
import { UserModel } from '../models/User'
import env from '../config/env'
import logger from '../utils/logger'

type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>

type TypedServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>

export function setupSocketHandlers(io: TypedServer) {
  // Authentication middleware for Socket.IO
  io.use(async (socket: TypedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split('token=')[1]?.split(';')[0]

      if (!token) {
        throw new Error('No authentication token provided')
      }

      const payload = jwt.verify(token, env.JWT_SECRET) as any
      const user = await UserModel.findById(payload.userId)

      if (!user) {
        throw new Error('User not found')
      }

      socket.data.userId = user._id.toString()
      socket.data.displayName = user.displayName

      next()
    } catch (error) {
      logger.error('Socket authentication error:', error)
      next(new Error('Authentication failed'))
    }
  })

  io.on('connection', (socket: TypedSocket) => {
    logger.info('User connected via socket', {
      socketId: socket.id,
      userId: socket.data.userId,
      displayName: socket.data.displayName,
    })

    // Handle room events
    socket.on('room:join', async (data) => {
      // TODO: Implement room joining logic
      logger.info('Room join attempt', { ...data, userId: socket.data.userId })
    })

    socket.on('room:leave', async (data) => {
      // TODO: Implement room leaving logic
      logger.info('Room leave attempt', { ...data, userId: socket.data.userId })
    })

    socket.on('room:set-status', async (data) => {
      // TODO: Implement room status change logic
      logger.info('Room status change attempt', { ...data, userId: socket.data.userId })
    })

    // Handle chat events
    socket.on('chat:send-message', async (data) => {
      // TODO: Implement message sending logic
      logger.info('Message send attempt', { ...data, userId: socket.data.userId })
    })

    socket.on('chat:typing-start', async (data) => {
      // TODO: Implement typing indicator logic
      socket.to(data.roomId).emit('chat:user-typing', {
        userId: socket.data.userId,
        displayName: socket.data.displayName,
        roomId: data.roomId,
      })
    })

    socket.on('chat:typing-stop', async (data) => {
      // TODO: Implement typing indicator logic
      socket.to(data.roomId).emit('chat:user-stopped-typing', {
        userId: socket.data.userId,
        roomId: data.roomId,
      })
    })

    // Handle WebRTC signaling
    socket.on('webrtc:offer', async (data) => {
      // TODO: Implement WebRTC offer forwarding
      socket.to(data.to).emit('webrtc:offer', {
        offer: data.offer,
        from: socket.data.userId,
        to: data.to,
      })
    })

    socket.on('webrtc:answer', async (data) => {
      // TODO: Implement WebRTC answer forwarding
      socket.to(data.to).emit('webrtc:answer', {
        answer: data.answer,
        from: socket.data.userId,
        to: data.to,
      })
    })

    socket.on('webrtc:ice-candidate', async (data) => {
      // TODO: Implement ICE candidate forwarding
      socket.to(data.to).emit('webrtc:ice-candidate', {
        candidate: data.candidate,
        from: socket.data.userId,
        to: data.to,
      })
    })

    socket.on('webrtc:ready', async () => {
      // TODO: Implement WebRTC ready signal
      if (socket.data.roomId) {
        socket.to(socket.data.roomId).emit('webrtc:user-joined', {
          userId: socket.data.userId,
          displayName: socket.data.displayName,
        })
      }
    })

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info('User disconnected from socket', {
        socketId: socket.id,
        userId: socket.data.userId,
        displayName: socket.data.displayName,
        reason,
      })

      // TODO: Handle cleanup when user disconnects
      // - Leave all rooms
      // - Notify other users
      // - Clean up WebRTC connections
    })
  })

  logger.info('Socket.IO handlers setup complete')
}
