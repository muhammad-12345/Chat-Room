import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'

import env from './config/env'
import { apiRateLimit } from './middleware/rateLimiting'
import { errorHandler } from './middleware/validation'
import logger from './utils/logger'

// Routes
import authRoutes from './routes/auth'
import roomRoutes from './routes/rooms'
import messageRoutes from './routes/messages'

export function createApp() {
  const app = express()

  // Security middleware
  app.use(helmet({
    crossOriginEmbedderPolicy: false, // Required for WebRTC
  }))

  // CORS configuration
  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }))

  // Compression
  app.use(compression())

  // Body parsing
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))
  app.use(cookieParser())

  // Request logging
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    })
    next()
  })

  // Rate limiting
  app.use('/api', apiRateLimit)

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    })
  })

  // API routes
  app.use('/api/auth', authRoutes)
  app.use('/api/rooms', roomRoutes)
  app.use('/api/messages', messageRoutes)

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    })
  })

  // Global error handler
  app.use(errorHandler)

  return app
}
