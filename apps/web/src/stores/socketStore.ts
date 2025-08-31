import { create } from 'zustand'
import { Socket } from 'socket.io-client'

import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from '@chat-room/shared'

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

interface SocketState {
  socket: TypedSocket | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  
  // Actions
  setSocket: (socket: TypedSocket | null) => void
  setConnected: (connected: boolean) => void
  setConnecting: (connecting: boolean) => void
  setError: (error: string | null) => void
}

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  
  setSocket: (socket) => set({ socket }),
  setConnected: (isConnected) => set({ isConnected }),
  setConnecting: (isConnecting) => set({ isConnecting }),
  setError: (error) => set({ error }),
}))
