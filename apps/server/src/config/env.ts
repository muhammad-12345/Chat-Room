import dotenv from 'dotenv'
import { z } from 'zod'

// Load environment variables
dotenv.config()

// Environment schema
const envSchema = z.object({
  // Database
  MONGODB_URI: z.string().url(),
  
  // Authentication
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_ROUNDS: z.coerce.number().int().min(8).max(15).default(12),
  
  // Server
  PORT: z.coerce.number().int().min(1000).max(65535).default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  
  // Optional
  REDIS_URL: z.string().url().optional(),
  STUN_SERVERS: z.string().default('stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().default(100),
  
  // File Upload
  MAX_FILE_SIZE: z.coerce.number().int().default(5242880), // 5MB
  
  // Frontend URL
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
})

// Validate and export environment variables
let env: z.infer<typeof envSchema>

try {
  env = envSchema.parse(process.env)
} catch (error) {
  console.error('❌ Invalid environment variables:')
  if (error instanceof z.ZodError) {
    error.errors.forEach(err => {
      console.error(`  ${err.path.join('.')}: ${err.message}`)
    })
  }
  process.exit(1)
}

export default env

// Type-safe environment variables
export type Env = typeof env
