import { Request, Response } from 'express'

import { UserModel } from '../models/User'
import { generateToken, setAuthCookie, clearAuthCookie, AuthenticatedRequest } from '../utils/auth'
import { HTTP_STATUS, ERROR_CODES, CreateUserSchema, LoginUserSchema } from '@chat-room/shared'
import logger from '../utils/logger'

/**
 * Register a new user
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, displayName } = req.body

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        error: ERROR_CODES.ACCOUNT_ALREADY_EXISTS,
        message: 'User with this email already exists',
      })
      return
    }

    // Create new user
    const user = new UserModel({
      email,
      passwordHash: password, // Will be hashed by pre-save middleware
      displayName,
    })

    await user.save()

    // Generate token
    const token = generateToken(user)

    // Set cookie
    setAuthCookie(res, token)

    logger.info('User registered successfully', { userId: user._id, email })

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          displayName: user.displayName,
        },
        token,
      },
      message: 'User registered successfully',
    })
  } catch (error) {
    logger.error('Registration error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to register user',
    })
  }
}

/**
 * Login user
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body

    // Find user with password
    const user = await UserModel.findByEmail(email)
    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Invalid email or password',
      })
      return
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Invalid email or password',
      })
      return
    }

    // Generate token
    const token = generateToken(user)

    // Set cookie
    setAuthCookie(res, token)

    logger.info('User logged in successfully', { userId: user._id, email })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          displayName: user.displayName,
        },
        token,
      },
      message: 'Login successful',
    })
  } catch (error) {
    logger.error('Login error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to login',
    })
  }
}

/**
 * Logout user
 */
export async function logout(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    // Clear cookie
    clearAuthCookie(res)

    logger.info('User logged out successfully', { userId: req.user?._id })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Logout successful',
    })
  } catch (error) {
    logger.error('Logout error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to logout',
    })
  }
}

/**
 * Get current user profile
 */
export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user!

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          displayName: user.displayName,
          createdAt: user.createdAt,
        },
      },
    })
  } catch (error) {
    logger.error('Get profile error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to get profile',
    })
  }
}

/**
 * Update user profile
 */
export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user!
    const { displayName } = req.body

    // Update user
    user.displayName = displayName
    await user.save()

    logger.info('User profile updated successfully', { userId: user._id })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          displayName: user.displayName,
          updatedAt: user.updatedAt,
        },
      },
      message: 'Profile updated successfully',
    })
  } catch (error) {
    logger.error('Update profile error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to update profile',
    })
  }
}

/**
 * Refresh authentication token
 */
export async function refreshToken(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user!

    // Generate new token
    const token = generateToken(user)

    // Set new cookie
    setAuthCookie(res, token)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        token,
      },
      message: 'Token refreshed successfully',
    })
  } catch (error) {
    logger.error('Refresh token error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to refresh token',
    })
  }
}
