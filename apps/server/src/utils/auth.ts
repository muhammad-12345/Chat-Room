import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

import env from '../config/env'
import { UserModel, UserDocument } from '../models/User'
import { HTTP_STATUS, ERROR_CODES } from '@chat-room/shared'
import logger from './logger'

export interface JWTPayload {
  userId: string
  email: string
  displayName: string
  iat?: number
  exp?: number
}

export interface AuthenticatedRequest extends Request {
  user?: UserDocument
}

/**
 * Generate JWT token for user
 */
export function generateToken(user: UserDocument): string {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    displayName: user.displayName,
  }

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  })
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error(ERROR_CODES.TOKEN_EXPIRED)
    }
    throw new Error(ERROR_CODES.TOKEN_INVALID)
  }
}

/**
 * Extract token from request
 */
export function extractToken(req: Request): string | null {
  // Check Authorization header
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  // Check cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token
  }

  return null
}

/**
 * Authentication middleware
 */
export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req)

    if (!token) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_CODES.TOKEN_INVALID,
        message: 'No authentication token provided',
      })
      return
    }

    const payload = verifyToken(token)
    const user = await UserModel.findById(payload.userId)

    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_CODES.ACCOUNT_NOT_FOUND,
        message: 'User not found',
      })
      return
    }

    req.user = user
    next()
  } catch (error) {
    logger.error('Authentication error:', error)
    
    let errorCode = ERROR_CODES.TOKEN_INVALID
    let message = 'Invalid token'

    if (error instanceof Error) {
      if (error.message === ERROR_CODES.TOKEN_EXPIRED) {
        errorCode = ERROR_CODES.TOKEN_EXPIRED
        message = 'Token has expired'
      }
    }

    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: errorCode,
      message,
    })
  }
}

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export async function optionalAuthenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req)

    if (token) {
      const payload = verifyToken(token)
      const user = await UserModel.findById(payload.userId)
      req.user = user || undefined
    }

    next()
  } catch (error) {
    // Silently fail for optional auth
    logger.debug('Optional authentication failed:', error)
    next()
  }
}

/**
 * Check if user is room creator
 */
export function requireRoomCreator(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  // This middleware should be used after authenticate and room loading
  // Implementation will be in room-specific middleware
  next()
}

/**
 * Set authentication cookie
 */
export function setAuthCookie(res: Response, token: string): void {
  const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  }

  res.cookie('token', token, cookieOptions)
}

/**
 * Clear authentication cookie
 */
export function clearAuthCookie(res: Response): void {
  res.clearCookie('token', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
}
