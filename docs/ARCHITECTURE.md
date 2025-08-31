# Chat Room Application Architecture

## 🏗️ System Overview

This is a production-ready real-time audio chat application built with a modern tech stack, featuring:

- **Real-time Audio Communication** via WebRTC
- **Instant Messaging** via Socket.IO
- **Room Management** with public/private rooms and lobby system
- **User Authentication** with JWT and secure password hashing
- **Professional Development Workflow** with TypeScript, testing, CI/CD

## 📁 Project Structure

```
chat-room/
├── apps/
│   ├── web/                 # React frontend (Vite + TypeScript)
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── pages/       # Route components
│   │   │   ├── stores/      # Zustand state management
│   │   │   ├── lib/         # API client, socket manager
│   │   │   └── config/      # Environment configuration
│   │   └── package.json
│   │
│   └── server/              # Express backend (Node.js + TypeScript)
│       ├── src/
│       │   ├── models/      # Mongoose database models
│       │   ├── controllers/ # Route handlers
│       │   ├── routes/      # API route definitions
│       │   ├── middleware/  # Custom middleware
│       │   ├── utils/       # Utility functions
│       │   ├── config/      # Database, environment config
│       │   └── socket/      # Socket.IO event handlers
│       └── package.json
│
├── packages/
│   ├── shared/              # Shared TypeScript types and utilities
│   │   ├── src/types/       # Type definitions
│   │   └── src/utils/       # Shared utility functions
│   │
│   └── config/              # Shared ESLint, TypeScript configs
│
├── .github/
│   ├── workflows/           # GitHub Actions CI/CD
│   ├── ISSUE_TEMPLATE.md
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docs/                    # Documentation
├── package.json             # Root package.json (workspace config)
├── pnpm-workspace.yaml      # pnpm workspace configuration
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** for styling
- **Zustand** for client state management
- **React Query** for server state management
- **React Router** for routing
- **Socket.IO Client** for real-time communication
- **Axios** for HTTP requests

### Backend
- **Node.js** with Express and TypeScript
- **Socket.IO** for real-time communication
- **MongoDB** with Mongoose for data persistence
- **JWT** for authentication
- **bcrypt** for password hashing
- **Zod** for validation
- **Winston** for logging

### Shared
- **TypeScript** throughout the stack
- **Zod** for schema validation
- **ESLint + Prettier** for code quality
- **pnpm** for package management

## 🔧 Core Features

### 1. Authentication System
- **JWT-based authentication** with HTTP-only cookies
- **Password hashing** with bcrypt
- **User registration and login**
- **Profile management**
- **Automatic token refresh**

### 2. Room Management
- **Public and private rooms**
- **Access code protection** for private rooms
- **Room status management** (inactive/live)
- **Creator permissions** for room control
- **Participant limits**

### 3. Lobby System
- **Inactive room queueing**
- **Automatic promotion** when room goes live
- **Position tracking** in lobby queue

### 4. Real-time Communication
- **Socket.IO integration** for instant messaging
- **WebRTC signaling** for audio communication
- **Typing indicators**
- **User presence tracking**

### 5. Security Features
- **Rate limiting** on API endpoints
- **Input validation** with Zod schemas
- **CORS protection**
- **Security headers** with Helmet
- **SQL injection prevention** with Mongoose

## 🔄 Data Flow

### Authentication Flow
1. User registers/logs in via REST API
2. Server validates credentials
3. JWT token issued and stored in HTTP-only cookie
4. Frontend stores user data in Zustand
5. Socket.IO authenticates using JWT

### Room Join Flow
1. User selects room to join
2. Frontend validates access (private room codes)
3. Socket.IO room:join event sent
4. Server validates permissions
5. User added to room or lobby
6. Real-time updates sent to all participants

### Message Flow
1. User types message in UI
2. Socket.IO chat:send-message event
3. Server validates and stores message
4. Message broadcast to room participants
5. UI updates in real-time

### WebRTC Audio Flow
1. User enables audio in room
2. Local media stream acquired
3. WebRTC offer/answer signaling via Socket.IO
4. ICE candidates exchanged
5. Peer-to-peer audio connection established

## 🗄️ Database Schema

### Users
```typescript
{
  _id: ObjectId
  email: string (unique, indexed)
  passwordHash: string
  displayName: string
  createdAt: Date
  updatedAt: Date
}
```

### Rooms
```typescript
{
  _id: ObjectId
  name: string
  description?: string
  isPrivate: boolean
  status: 'inactive' | 'live'
  accessCodeHash?: string
  creatorId: ObjectId (ref: User)
  participantCount: number
  maxParticipants: number
  createdAt: Date
  updatedAt: Date
}
```

### Messages
```typescript
{
  _id: ObjectId
  roomId: ObjectId (ref: Room)
  userId: ObjectId (ref: User)
  content: string
  type: 'text' | 'system'
  createdAt: Date
  updatedAt: Date
}
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Rooms
- `GET /api/rooms` - List public rooms
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms` - Create new room
- `PUT /api/rooms/:id` - Update room (creator only)
- `DELETE /api/rooms/:id` - Delete room (creator only)
- `POST /api/rooms/:id/join` - Join room attempt
- `POST /api/rooms/:id/status` - Set room status (creator only)

### Messages
- `GET /api/messages/:roomId` - Get room messages
- `POST /api/messages/:roomId` - Send message (HTTP fallback)

## ⚡ Socket.IO Events

### Client to Server
- `room:join` - Join a room
- `room:leave` - Leave a room
- `room:set-status` - Change room status
- `chat:send-message` - Send chat message
- `chat:typing-start/stop` - Typing indicators
- `webrtc:offer/answer/ice-candidate` - WebRTC signaling

### Server to Client
- `room:joined/left` - Room state changes
- `room:user-joined/left` - Participant updates
- `room:waiting-in-lobby` - Lobby notifications
- `chat:message` - New chat messages
- `chat:user-typing` - Typing indicators
- `webrtc:*` - WebRTC signaling events

## 🔐 Security Considerations

### Authentication
- JWT tokens stored in HTTP-only cookies
- Secure password hashing with bcrypt
- Token expiration and refresh

### Authorization
- Room creator permissions
- Private room access codes
- User session validation

### Input Validation
- Zod schema validation on all inputs
- SQL injection prevention
- XSS protection

### Rate Limiting
- API endpoint rate limiting
- Authentication attempt limiting
- Message sending rate limiting

## 📦 Deployment Architecture

### Development
- Frontend: Vite dev server (localhost:3000)
- Backend: Node.js dev server (localhost:3001)
- Database: Local MongoDB or Atlas

### Production
- **Frontend**: Vercel (static hosting)
- **Backend**: Railway/Render (container hosting)
- **Database**: MongoDB Atlas (cloud)
- **CDN**: Vercel Edge Network

## 🔄 CI/CD Pipeline

### GitHub Actions
- **Lint and Format** checks on PRs
- **TypeScript** compilation
- **Test** execution
- **Security** audit
- **Build** verification

### Deployment
- **Automatic deployment** on push to main
- **Environment-specific** configurations
- **Health checks** and monitoring

## 🚧 Future Enhancements

### Short Term
- Complete WebRTC audio implementation
- Advanced lobby management
- Message history pagination
- User presence indicators

### Medium Term
- Video chat support
- Screen sharing
- File sharing
- Push notifications

### Long Term
- Mobile applications
- Advanced moderation tools
- Analytics dashboard
- Scalability improvements

## 📊 Performance Considerations

### Frontend
- Code splitting with React.lazy
- Image optimization
- Bundle size monitoring
- Progressive Web App features

### Backend
- Database indexing
- Connection pooling
- Caching with Redis
- Load balancing

### Real-time
- WebSocket connection management
- Room-based event distribution
- Efficient message broadcasting
- Connection state recovery
