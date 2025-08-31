import rateLimit from 'express-rate-limit'

import env from '../config/env'
import { HTTP_STATUS, ERROR_CODES, RATE_LIMITS } from '@chat-room/shared'
import logger from '../utils/logger'

/**
 * General API rate limiter
 */
export const apiRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: ERROR_CODES.RATE_LIMIT_EXCEEDED,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      userAgent: req.get('user-agent'),
    })

    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: 'Too many requests, please try again later',
    })
  },
})

/**
 * Strict rate limiter for authentication endpoints
 */
export const authRateLimit = rateLimit({
  windowMs: RATE_LIMITS.AUTH.windowMs,
  max: RATE_LIMITS.AUTH.max,
  message: {
    success: false,
    error: ERROR_CODES.RATE_LIMIT_EXCEEDED,
    message: 'Too many authentication attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    logger.warn('Authentication rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      userAgent: req.get('user-agent'),
    })

    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: 'Too many authentication attempts, please try again later',
    })
  },
})

/**
 * Rate limiter for message sending
 */
export const messageRateLimit = rateLimit({
  windowMs: RATE_LIMITS.MESSAGES.windowMs,
  max: RATE_LIMITS.MESSAGES.max,
  message: {
    success: false,
    error: ERROR_CODES.RATE_LIMIT_EXCEEDED,
    message: 'Too many messages, please slow down',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise IP
    return (req as any).user?.id || req.ip
  },
  handler: (req, res) => {
    logger.warn('Message rate limit exceeded', {
      userId: (req as any).user?.id,
      ip: req.ip,
      path: req.path,
    })

    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: 'Too many messages, please slow down',
    })
  },
})

/**
 * Create custom rate limiter with specific options
 */
export function createRateLimit(options: {
  windowMs: number
  max: number
  message?: string
  skipSuccessfulRequests?: boolean
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: {
      success: false,
      error: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: options.message || 'Too many requests',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    handler: (req, res) => {
      logger.warn('Custom rate limit exceeded', {
        ip: req.ip,
        path: req.path,
        options,
      })

      res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
        success: false,
        error: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        message: options.message || 'Too many requests',
      })
    },
  })
}
