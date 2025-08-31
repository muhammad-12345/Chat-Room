import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'

import { HTTP_STATUS, ERROR_CODES } from '@chat-room/shared'
import env from '../config/env'
import logger from '../utils/logger'

export interface ValidationOptions {
  body?: ZodSchema
  query?: ZodSchema
  params?: ZodSchema
}

/**
 * Express middleware for request validation using Zod schemas
 */
export function validate(options: ValidationOptions) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate request body
      if (options.body) {
        req.body = options.body.parse(req.body)
      }

      // Validate query parameters
      if (options.query) {
        req.query = options.query.parse(req.query)
      }

      // Validate route parameters
      if (options.params) {
        req.params = options.params.parse(req.params)
      }

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }))

        logger.warn('Validation error:', { errors: validationErrors, path: req.path })

        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: ERROR_CODES.VALIDATION_ERROR,
          message: 'Validation failed',
          details: validationErrors,
        })
        return
      }

      logger.error('Unexpected validation error:', error)
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: ERROR_CODES.INTERNAL_ERROR,
        message: 'Internal server error',
      })
    }
  }
}

/**
 * Async wrapper for route handlers to catch errors
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  })

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error: any) => ({
      field: error.path,
      message: error.message,
    }))

    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_CODES.VALIDATION_ERROR,
      message: 'Validation failed',
      details: errors,
    })
    return
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      error: ERROR_CODES.ACCOUNT_ALREADY_EXISTS,
      message: `${field} already exists`,
    })
    return
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: ERROR_CODES.TOKEN_INVALID,
      message: 'Invalid token',
    })
    return
  }

  if (err.name === 'TokenExpiredError') {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: ERROR_CODES.TOKEN_EXPIRED,
      message: 'Token has expired',
    })
    return
  }

  // Default error response
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
  const message = err.message || 'Internal server error'

  res.status(statusCode).json({
    success: false,
    error: ERROR_CODES.INTERNAL_ERROR,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : message,
  })
}
