import { Router } from 'express'

import * as authController from '../controllers/authController'
import { validate, asyncHandler } from '../middleware/validation'
import { authenticate } from '../utils/auth'
import { authRateLimit } from '../middleware/rateLimiting'
import { CreateUserSchema, LoginUserSchema, UpdateUserSchema } from '@chat-room/shared'

const router = Router()

// Apply rate limiting to all auth routes
router.use(authRateLimit)

// Public routes
router.post(
  '/register',
  validate({ body: CreateUserSchema }),
  asyncHandler(authController.register)
)

router.post(
  '/login',
  validate({ body: LoginUserSchema }),
  asyncHandler(authController.login)
)

// Protected routes
router.post('/logout', authenticate, asyncHandler(authController.logout))

router.get('/profile', authenticate, asyncHandler(authController.getProfile))

router.put(
  '/profile',
  authenticate,
  validate({ body: UpdateUserSchema }),
  asyncHandler(authController.updateProfile)
)

router.post('/refresh', authenticate, asyncHandler(authController.refreshToken))

export default router
