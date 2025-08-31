import { z } from 'zod'
import type { PublicUser } from './user'
import type { PublicRoom } from './room'
import type { MessageWithUser } from './message'

// Socket Events
export interface ServerToClientEvents {
  // Room events
  'room:joined': (data: { room: PublicRoom; users: PublicUser[] }) => void
  'room:left': (data: { roomId: string }) => void
  'room:status-changed': (data: { roomId: string; status: 'inactive' | 'live' }) => void
  'room:user-joined': (data: { user: PublicUser; roomId: string }) => void
  'room:user-left': (data: { userId: string; roomId: string }) => void
  'room:waiting-in-lobby': (data: { roomId: string; position: number }) => void
  'room:moved-from-lobby': (data: { roomId: string }) => void

  // Chat events
  'chat:message': (data: MessageWithUser) => void
  'chat:user-typing': (data: { userId: string; displayName: string; roomId: string }) => void
  'chat:user-stopped-typing': (data: { userId: string; roomId: string }) => void

  // WebRTC signaling events
  'webrtc:user-joined': (data: { userId: string; displayName: string }) => void
  'webrtc:user-left': (data: { userId: string }) => void
  'webrtc:offer': (data: { offer: RTCSessionDescriptionInit; from: string; to: string }) => void
  'webrtc:answer': (data: { answer: RTCSessionDescriptionInit; from: string; to: string }) => void
  'webrtc:ice-candidate': (data: { candidate: RTCIceCandidateInit; from: string; to: string }) => void

  // Error events
  'error': (data: { message: string; code?: string }) => void
  'auth:error': (data: { message: string }) => void
}

export interface ClientToServerEvents {
  // Room events
  'room:join': (data: { roomId: string; accessCode?: string }) => void
  'room:leave': (data: { roomId: string }) => void
  'room:set-status': (data: { roomId: string; status: 'inactive' | 'live' }) => void

  // Chat events
  'chat:send-message': (data: { roomId: string; content: string }) => void
  'chat:typing-start': (data: { roomId: string }) => void
  'chat:typing-stop': (data: { roomId: string }) => void

  // WebRTC signaling events
  'webrtc:offer': (data: { offer: RTCSessionDescriptionInit; to: string }) => void
  'webrtc:answer': (data: { answer: RTCSessionDescriptionInit; to: string }) => void
  'webrtc:ice-candidate': (data: { candidate: RTCIceCandidateInit; to: string }) => void
  'webrtc:ready': () => void
}

export interface InterServerEvents {
  // For scaling across multiple server instances
}

export interface SocketData {
  userId: string
  displayName: string
  roomId?: string
  isInLobby?: boolean
}

// Validation schemas for socket events
export const JoinRoomEventSchema = z.object({
  roomId: z.string(),
  accessCode: z.string().optional(),
})

export const SendMessageEventSchema = z.object({
  roomId: z.string(),
  content: z.string().min(1).max(1000),
})

export const WebRTCOfferEventSchema = z.object({
  offer: z.object({
    type: z.literal('offer'),
    sdp: z.string(),
  }),
  to: z.string(),
})

export const WebRTCAnswerEventSchema = z.object({
  answer: z.object({
    type: z.literal('answer'),
    sdp: z.string(),
  }),
  to: z.string(),
})

export const WebRTCIceCandidateEventSchema = z.object({
  candidate: z.object({
    candidate: z.string(),
    sdpMid: z.string().nullable(),
    sdpMLineIndex: z.number().nullable(),
  }),
  to: z.string(),
})

export const SetRoomStatusEventSchema = z.object({
  roomId: z.string(),
  status: z.enum(['inactive', 'live']),
})

// Type exports
export type JoinRoomEvent = z.infer<typeof JoinRoomEventSchema>
export type SendMessageEvent = z.infer<typeof SendMessageEventSchema>
export type WebRTCOfferEvent = z.infer<typeof WebRTCOfferEventSchema>
export type WebRTCAnswerEvent = z.infer<typeof WebRTCAnswerEventSchema>
export type WebRTCIceCandidateEvent = z.infer<typeof WebRTCIceCandidateEventSchema>
export type SetRoomStatusEvent = z.infer<typeof SetRoomStatusEventSchema>
