import mongoose from 'mongoose';

const interviewResultSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
      unique: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    technicalScore: { type: Number, min: 0, max: 100, default: 0 },
    communicationScore: { type: Number, min: 0, max: 100, default: 0 },
    problemSolvingScore: { type: Number, min: 0, max: 100, default: 0 },
    codeQualityScore: { type: Number, min: 0, max: 100, default: 0 },
    overallScore: { type: Number, min: 0, max: 100, default: 0 },
    hiringRecommendation: {
      type: String,
      enum: ['Strong Hire', 'Hire', 'Weak Hire', 'Reject'],
      default: 'Hire',
    },
    aiSummary: { type: String, default: '' },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    feedback: { type: String, default: '' },
  },
  { timestamps: true }
);

export const InterviewResult = mongoose.model('InterviewResult', interviewResultSchema);
