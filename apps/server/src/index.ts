import { createServer } from 'http'
import { Server } from 'socket.io'

import { createApp } from './app'
import env from './config/env'
import database from './config/database'
import logger from './utils/logger'
import { setupSocketHandlers } from './socket/socketHandler'

async function startServer() {
  try {
    // Connect to database
    await database.connect()

    // Create Express app
    const app = createApp()

    // Create HTTP server
    const server = createServer(app)

    // Setup Socket.IO
    const io = new Server(server, {
      cors: {
        origin: env.CORS_ORIGIN,
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    })

    // Setup socket event handlers
    setupSocketHandlers(io)

    // Start server
    server.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`)
      logger.info(`📊 Environment: ${env.NODE_ENV}`)
      logger.info(`🌐 CORS Origin: ${env.CORS_ORIGIN}`)
    })

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully`)

      server.close(async () => {
        logger.info('HTTP server closed')
        
        try {
          await database.disconnect()
          logger.info('Database connection closed')
          process.exit(0)
        } catch (error) {
          logger.error('Error during shutdown:', error)
          process.exit(1)
        }
      })

      // Force close server after 30s
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down')
        process.exit(1)
      }, 30000)
    }

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Start the server
startServer()
