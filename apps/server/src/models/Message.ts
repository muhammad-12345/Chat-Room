import mongoose, { Document, Schema, Model } from 'mongoose'

import { Message as IMessage } from '@chat-room/shared'

export interface MessageDocument extends Document, Omit<IMessage, '_id'> {
  toJSON(): Partial<MessageDocument>
}

interface MessageModel extends Model<MessageDocument> {
  findByRoom(
    roomId: string,
    limit?: number,
    before?: string
  ): Promise<MessageDocument[]>
  findRecentByRoom(roomId: string, limit?: number): Promise<MessageDocument[]>
}

const messageSchema = new Schema<MessageDocument>(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },
    type: {
      type: String,
      enum: ['text', 'system'],
      default: 'text',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret._id = ret._id.toString()
        ret.roomId = ret.roomId.toString()
        ret.userId = ret.userId.toString()
        delete ret.__v
        return ret
      },
    },
  }
)

// Indexes
messageSchema.index({ roomId: 1, createdAt: -1 })
messageSchema.index({ userId: 1 })
messageSchema.index({ createdAt: -1 })

// Static methods
messageSchema.statics.findByRoom = function (
  roomId: string,
  limit = 50,
  before?: string
) {
  const query: any = { roomId }
  
  if (before) {
    query.createdAt = { $lt: new Date(before) }
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'displayName')
    .exec()
}

messageSchema.statics.findRecentByRoom = function (
  roomId: string,
  limit = 20
) {
  return this.find({ roomId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'displayName')
    .exec()
}

export const MessageModel = mongoose.model<MessageDocument, MessageModel>(
  'Message',
  messageSchema
)
