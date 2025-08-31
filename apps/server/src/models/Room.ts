import mongoose, { Document, Schema, Model } from 'mongoose'
import bcrypt from 'bcryptjs'

import { Room as IRoom, RoomStatus } from '@chat-room/shared'
import env from '../config/env'

export interface RoomDocument extends Document, Omit<IRoom, '_id'> {
  accessCodeHash?: string
  compareAccessCode(candidateCode: string): Promise<boolean>
  toJSON(): Partial<RoomDocument>
}

interface RoomModel extends Model<RoomDocument> {
  findPublicRooms(limit?: number, skip?: number): Promise<RoomDocument[]>
  findByCreator(creatorId: string): Promise<RoomDocument[]>
}

const roomSchema = new Schema<RoomDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    isPrivate: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(RoomStatus),
      default: RoomStatus.INACTIVE,
      required: true,
    },
    accessCodeHash: {
      type: String,
      select: false, // Don't include in queries by default
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participantCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxParticipants: {
      type: Number,
      default: 10,
      min: 1,
      max: 50,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret._id = ret._id.toString()
        ret.creatorId = ret.creatorId.toString()
        delete ret.accessCodeHash
        delete ret.__v
        return ret
      },
    },
  }
)

// Indexes
roomSchema.index({ creatorId: 1 })
roomSchema.index({ status: 1 })
roomSchema.index({ isPrivate: 1 })
roomSchema.index({ createdAt: -1 })
roomSchema.index({ name: 'text', description: 'text' }) // Text search

// Instance methods
roomSchema.methods.compareAccessCode = async function (
  candidateCode: string
): Promise<boolean> {
  if (!this.accessCodeHash) {
    return false
  }
  return bcrypt.compare(candidateCode, this.accessCodeHash)
}

// Static methods
roomSchema.statics.findPublicRooms = function (limit = 20, skip = 0) {
  return this.find({ isPrivate: false })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('creatorId', 'displayName')
}

roomSchema.statics.findByCreator = function (creatorId: string) {
  return this.find({ creatorId })
    .sort({ createdAt: -1 })
    .populate('creatorId', 'displayName')
}

// Pre-save middleware to hash access code
roomSchema.pre('save', async function (next) {
  // Only hash if we have an access code and it's been modified
  if (!this.accessCodeHash || !this.isModified('accessCodeHash')) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(env.BCRYPT_ROUNDS)
    this.accessCodeHash = await bcrypt.hash(this.accessCodeHash, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Pre-update middleware to hash access code
roomSchema.pre(['updateOne', 'findOneAndUpdate'], async function (next) {
  const update = this.getUpdate() as any

  if (update.accessCodeHash) {
    try {
      const salt = await bcrypt.genSalt(env.BCRYPT_ROUNDS)
      update.accessCodeHash = await bcrypt.hash(update.accessCodeHash, salt)
    } catch (error) {
      return next(error as Error)
    }
  }

  next()
})

export const RoomModel = mongoose.model<RoomDocument, RoomModel>(
  'Room',
  roomSchema
)
