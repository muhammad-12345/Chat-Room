import mongoose from 'mongoose'

import env from './env'
import logger from '../utils/logger'

class Database {
  private static instance: Database
  private isConnected = false

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      logger.warn('Database already connected')
      return
    }

    try {
      const options = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4, skip trying IPv6
      }

      await mongoose.connect(env.MONGODB_URI, options)
      
      this.isConnected = true
      logger.info('✅ Database connected successfully')

      // Handle connection events
      mongoose.connection.on('error', (error) => {
        logger.error('Database connection error:', error)
      })

      mongoose.connection.on('disconnected', () => {
        logger.warn('Database disconnected')
        this.isConnected = false
      })

      mongoose.connection.on('reconnected', () => {
        logger.info('Database reconnected')
        this.isConnected = true
      })

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await this.disconnect()
        process.exit(0)
      })

    } catch (error) {
      logger.error('❌ Failed to connect to database:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return
    }

    try {
      await mongoose.disconnect()
      this.isConnected = false
      logger.info('Database disconnected')
    } catch (error) {
      logger.error('Error disconnecting from database:', error)
      throw error
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected
  }
}

export default Database.getInstance()
