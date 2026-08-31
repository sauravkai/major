import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['login', 'logout'],
      required: true,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    device: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Session = mongoose.model('Session', sessionSchema);
