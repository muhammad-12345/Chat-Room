// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const

// Error Codes
export const ERROR_CODES = {
  // Authentication
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  ACCOUNT_NOT_FOUND: 'ACCOUNT_NOT_FOUND',
  ACCOUNT_ALREADY_EXISTS: 'ACCOUNT_ALREADY_EXISTS',
  
  // Authorization
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  ACCESS_DENIED: 'ACCESS_DENIED',
  
  // Rooms
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  ROOM_ACCESS_DENIED: 'ROOM_ACCESS_DENIED',
  ROOM_FULL: 'ROOM_FULL',
  ROOM_INACTIVE: 'ROOM_INACTIVE',
  INVALID_ACCESS_CODE: 'INVALID_ACCESS_CODE',
  ALREADY_IN_ROOM: 'ALREADY_IN_ROOM',
  NOT_IN_ROOM: 'NOT_IN_ROOM',
  NOT_ROOM_CREATOR: 'NOT_ROOM_CREATOR',
  
  // Messages
  MESSAGE_TOO_LONG: 'MESSAGE_TOO_LONG',
  MESSAGE_EMPTY: 'MESSAGE_EMPTY',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const

// Socket Events
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Room events
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_JOINED: 'room:joined',
  ROOM_LEFT: 'room:left',
  ROOM_STATUS_CHANGED: 'room:status-changed',
  ROOM_USER_JOINED: 'room:user-joined',
  ROOM_USER_LEFT: 'room:user-left',
  ROOM_WAITING_IN_LOBBY: 'room:waiting-in-lobby',
  ROOM_MOVED_FROM_LOBBY: 'room:moved-from-lobby',
  ROOM_SET_STATUS: 'room:set-status',
  
  // Chat events
  CHAT_SEND_MESSAGE: 'chat:send-message',
  CHAT_MESSAGE: 'chat:message',
  CHAT_TYPING_START: 'chat:typing-start',
  CHAT_TYPING_STOP: 'chat:typing-stop',
  CHAT_USER_TYPING: 'chat:user-typing',
  CHAT_USER_STOPPED_TYPING: 'chat:user-stopped-typing',
  
  // WebRTC events
  WEBRTC_READY: 'webrtc:ready',
  WEBRTC_OFFER: 'webrtc:offer',
  WEBRTC_ANSWER: 'webrtc:answer',
  WEBRTC_ICE_CANDIDATE: 'webrtc:ice-candidate',
  WEBRTC_USER_JOINED: 'webrtc:user-joined',
  WEBRTC_USER_LEFT: 'webrtc:user-left',
  
  // Error events
  ERROR: 'error',
  AUTH_ERROR: 'auth:error',
} as const

// Room Constants
export const ROOM_CONSTANTS = {
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_ACCESS_CODE_LENGTH: 4,
  MAX_ACCESS_CODE_LENGTH: 20,
  DEFAULT_MAX_PARTICIPANTS: 10,
  MAX_PARTICIPANTS_LIMIT: 50,
} as const

// Message Constants
export const MESSAGE_CONSTANTS = {
  MAX_CONTENT_LENGTH: 1000,
  MIN_CONTENT_LENGTH: 1,
} as const

// User Constants
export const USER_CONSTANTS = {
  MIN_DISPLAY_NAME_LENGTH: 1,
  MAX_DISPLAY_NAME_LENGTH: 50,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 100,
} as const

// Rate Limiting
export const RATE_LIMITS = {
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
  },
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
  },
  MESSAGES: {
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 messages per minute
  },
} as const

// WebRTC Configuration
export const WEBRTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
  iceCandidatePoolSize: 10,
} as const

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 100,
} as const
