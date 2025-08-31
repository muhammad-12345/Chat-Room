# Chat Room - Real-time Audio Chat Application

A professional-grade real-time audio chat application built with React, Node.js, Socket.IO, and WebRTC.

## 🚀 Features

- **Real-time Audio Chat**: Multi-party audio communication using WebRTC
- **Text Messaging**: Instant messaging with Socket.IO
- **Room Management**: Create public/private rooms with access codes
- **User Authentication**: Secure JWT-based authentication
- **Lobby System**: Queue system for inactive rooms
- **Modern UI**: Beautiful, responsive React interface
- **Production Ready**: Professional code structure with TypeScript

## 🏗️ Architecture

This is a monorepo project using pnpm workspaces:

```
chat-room/
├── apps/
│   ├── web/          # React frontend (Vite + TypeScript)
│   └── server/       # Express backend (Socket.IO + MongoDB)
├── packages/
│   ├── shared/       # Shared types and utilities
│   └── config/       # ESLint and TypeScript configurations
└── docs/            # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Zustand** for state management
- **React Query** for server state
- **Socket.IO Client** for real-time communication
- **WebRTC** for audio communication
- **Tailwind CSS** for styling

### Backend
- **Node.js** with Express and TypeScript
- **Socket.IO** for real-time communication
- **MongoDB** with Mongoose for data persistence
- **JWT** authentication with HTTP-only cookies
- **bcrypt** for password hashing
- **Zod** for validation
- **Rate limiting** and security headers

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- MongoDB (local or Atlas)
- Redis (optional, for caching)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chat-room
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy environment files:
```bash
cp .env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

4. Configure environment variables in both `.env` files (see Environment Configuration section)

5. Start development servers:
```bash
pnpm dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 🔧 Environment Configuration

### Backend (`apps/server/.env`)

**Required:**
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens (use a strong, random string)

**Optional:**
- `PORT`: Server port (default: 3001)
- `REDIS_URL`: Redis connection for caching
- `BCRYPT_ROUNDS`: Password hashing rounds (default: 12)

### Frontend (`apps/web/.env`)

**Required:**
- `VITE_API_URL`: Backend API URL
- `VITE_WS_URL`: WebSocket server URL

**Optional:**
- `VITE_STUN_SERVERS`: STUN servers for WebRTC

## 📦 Available Scripts

```bash
# Development
pnpm dev              # Start all development servers
pnpm dev:web          # Start only frontend
pnpm dev:server       # Start only backend

# Building
pnpm build            # Build all packages
pnpm build:web        # Build frontend only
pnpm build:server     # Build backend only

# Code Quality
pnpm lint             # Lint all packages
pnpm lint:fix         # Fix linting issues
pnpm type-check       # TypeScript type checking
pnpm format           # Format code with Prettier

# Testing
pnpm test             # Run all tests
pnpm test:web         # Run frontend tests
pnpm test:server      # Run backend tests
```

## 🔐 Security Features

- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt
- Input validation with Zod schemas
- Rate limiting on API endpoints
- CORS protection
- Security headers with Helmet
- Access code hashing for private rooms

## 🌐 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Ensure WebSocket support is enabled
4. Deploy automatically on push to main

### Database (MongoDB Atlas)
1. Create a free M0 cluster
2. Add connection string to environment variables
3. Configure network access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.

---

Made with ❤️ by [Your Name]
