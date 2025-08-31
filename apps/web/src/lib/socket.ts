import { io, Socket } from 'socket.io-client'
import toast from 'react-hot-toast'

import config from '@/config/env'
import { useSocketStore } from '@/stores/socketStore'
import { useAuthStore } from '@/stores/authStore'
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from '@chat-room/shared'

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

class SocketManager {
  private socket: TypedSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(): TypedSocket | null {
    const { token } = useAuthStore.getState()
    const { setSocket, setConnected, setConnecting, setError } = useSocketStore.getState()

    if (!token) {
      console.warn('No authentication token found')
      return null
    }

    if (this.socket?.connected) {
      console.log('Socket already connected')
      return this.socket
    }

    try {
      setConnecting(true)
      setError(null)

      this.socket = io(config.wsUrl, {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
      }) as TypedSocket

      this.setupEventHandlers()
      setSocket(this.socket)

      return this.socket
    } catch (error) {
      console.error('Failed to connect socket:', error)
      setError('Failed to connect to server')
      setConnecting(false)
      return null
    }
  }

  disconnect() {
    const { setSocket, setConnected, setConnecting } = useSocketStore.getState()
    
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    
    setSocket(null)
    setConnected(false)
    setConnecting(false)
    this.reconnectAttempts = 0
  }

  getSocket(): TypedSocket | null {
    return this.socket
  }

  private setupEventHandlers() {
    if (!this.socket) return

    const { setConnected, setConnecting, setError } = useSocketStore.getState()

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id)
      setConnected(true)
      setConnecting(false)
      setError(null)
      this.reconnectAttempts = 0
      
      if (this.reconnectAttempts > 0) {
        toast.success('Reconnected to server')
      }
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      setConnected(false)
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect
        setError('Disconnected by server')
      } else if (reason === 'io client disconnect') {
        // Client initiated disconnect (manual)
        setError(null)
      } else {
        // Network/connection issues
        setError('Connection lost')
        this.handleReconnection()
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      setConnecting(false)
      
      if (error.message.includes('Authentication')) {
        setError('Authentication failed')
        // Clear auth and redirect to login
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
      } else {
        setError('Failed to connect to server')
        this.handleReconnection()
      }
    })

    // Error events
    this.socket.on('error', (error) => {
      console.error('Socket error:', error)
      toast.error(error.message || 'Socket error occurred')
    })

    this.socket.on('auth:error', (error) => {
      console.error('Socket auth error:', error)
      toast.error(error.message || 'Authentication error')
      
      // Clear auth and redirect to login
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
    })
  }

  private handleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached')
      toast.error('Unable to reconnect to server')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)
    
    setTimeout(() => {
      if (!this.socket?.connected) {
        console.log('Attempting socket reconnection...')
        this.connect()
      }
    }, delay)
  }

  // Utility methods for common socket operations
  joinRoom(roomId: string, accessCode?: string) {
    this.socket?.emit('room:join', { roomId, accessCode })
  }

  leaveRoom(roomId: string) {
    this.socket?.emit('room:leave', { roomId })
  }

  sendMessage(roomId: string, content: string) {
    this.socket?.emit('chat:send-message', { roomId, content })
  }

  setRoomStatus(roomId: string, status: 'inactive' | 'live') {
    this.socket?.emit('room:set-status', { roomId, status })
  }

  // WebRTC signaling methods
  sendOffer(to: string, offer: RTCSessionDescriptionInit) {
    this.socket?.emit('webrtc:offer', { offer, to })
  }

  sendAnswer(to: string, answer: RTCSessionDescriptionInit) {
    this.socket?.emit('webrtc:answer', { answer, to })
  }

  sendIceCandidate(to: string, candidate: RTCIceCandidateInit) {
    this.socket?.emit('webrtc:ice-candidate', { candidate, to })
  }

  notifyReady() {
    this.socket?.emit('webrtc:ready')
  }

  // Typing indicators
  startTyping(roomId: string) {
    this.socket?.emit('chat:typing-start', { roomId })
  }

  stopTyping(roomId: string) {
    this.socket?.emit('chat:typing-stop', { roomId })
  }
}

export const socketManager = new SocketManager()
export default socketManager
