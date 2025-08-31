import { create } from 'zustand'

import type { PublicRoom, PublicUser, MessageWithUser } from '@chat-room/shared'

interface RoomState {
  // Current room state
  currentRoom: PublicRoom | null
  participants: PublicUser[]
  messages: MessageWithUser[]
  
  // Lobby state
  isInLobby: boolean
  lobbyPosition: number
  
  // Audio state
  isAudioEnabled: boolean
  isMuted: boolean
  audioDevices: MediaDeviceInfo[]
  localStream: MediaStream | null
  
  // Typing indicators
  typingUsers: string[]
  
  // Actions
  setCurrentRoom: (room: PublicRoom | null) => void
  setParticipants: (participants: PublicUser[]) => void
  addParticipant: (participant: PublicUser) => void
  removeParticipant: (userId: string) => void
  
  setMessages: (messages: MessageWithUser[]) => void
  addMessage: (message: MessageWithUser) => void
  
  setLobbyState: (isInLobby: boolean, position?: number) => void
  
  setAudioEnabled: (enabled: boolean) => void
  setMuted: (muted: boolean) => void
  setAudioDevices: (devices: MediaDeviceInfo[]) => void
  setLocalStream: (stream: MediaStream | null) => void
  
  setTypingUsers: (users: string[]) => void
  addTypingUser: (userId: string) => void
  removeTypingUser: (userId: string) => void
  
  // Reset actions
  resetRoom: () => void
  resetAudio: () => void
}

export const useRoomStore = create<RoomState>((set, get) => ({
  // Current room state
  currentRoom: null,
  participants: [],
  messages: [],
  
  // Lobby state
  isInLobby: false,
  lobbyPosition: 0,
  
  // Audio state
  isAudioEnabled: false,
  isMuted: false,
  audioDevices: [],
  localStream: null,
  
  // Typing indicators
  typingUsers: [],
  
  // Actions
  setCurrentRoom: (room) => set({ currentRoom: room }),
  
  setParticipants: (participants) => set({ participants }),
  addParticipant: (participant) => {
    const { participants } = get()
    const exists = participants.some(p => p._id === participant._id)
    if (!exists) {
      set({ participants: [...participants, participant] })
    }
  },
  removeParticipant: (userId) => {
    const { participants } = get()
    set({ participants: participants.filter(p => p._id !== userId) })
  },
  
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => {
    const { messages } = get()
    set({ messages: [...messages, message] })
  },
  
  setLobbyState: (isInLobby, position = 0) => 
    set({ isInLobby, lobbyPosition: position }),
  
  setAudioEnabled: (enabled) => set({ isAudioEnabled: enabled }),
  setMuted: (muted) => set({ isMuted: muted }),
  setAudioDevices: (devices) => set({ audioDevices: devices }),
  setLocalStream: (stream) => set({ localStream: stream }),
  
  setTypingUsers: (users) => set({ typingUsers: users }),
  addTypingUser: (userId) => {
    const { typingUsers } = get()
    if (!typingUsers.includes(userId)) {
      set({ typingUsers: [...typingUsers, userId] })
    }
  },
  removeTypingUser: (userId) => {
    const { typingUsers } = get()
    set({ typingUsers: typingUsers.filter(id => id !== userId) })
  },
  
  // Reset actions
  resetRoom: () => set({
    currentRoom: null,
    participants: [],
    messages: [],
    isInLobby: false,
    lobbyPosition: 0,
    typingUsers: [],
  }),
  
  resetAudio: () => {
    const { localStream } = get()
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    set({
      isAudioEnabled: false,
      isMuted: false,
      localStream: null,
    })
  },
}))
