import mongoose, { Document, Schema, Model } from 'mongoose'
import bcrypt from 'bcryptjs'

import { User as IUser } from '@chat-room/shared'
import env from '../config/env'

export interface UserDocument extends Document, Omit<IUser, '_id'> {
  passwordHash: string
  comparePassword(candidatePassword: string): Promise<boolean>
  toJSON(): Partial<UserDocument>
}

interface UserModel extends Model<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // Don't include in queries by default
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret._id = ret._id.toString()
        delete ret.passwordHash
        delete ret.__v
        return ret
      },
    },
  }
)

// Indexes
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ createdAt: -1 })

// Instance methods
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash)
}

// Static methods
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email }).select('+passwordHash')
}

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('passwordHash')) return next()

  try {
    const salt = await bcrypt.genSalt(env.BCRYPT_ROUNDS)
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Pre-update middleware to hash password
userSchema.pre(['updateOne', 'findOneAndUpdate'], async function (next) {
  const update = this.getUpdate() as any

  if (update.passwordHash) {
    try {
      const salt = await bcrypt.genSalt(env.BCRYPT_ROUNDS)
      update.passwordHash = await bcrypt.hash(update.passwordHash, salt)
    } catch (error) {
      return next(error as Error)
    }
  }

  next()
})

export const UserModel = mongoose.model<UserDocument, UserModel>(
  'User',
  userSchema
)
