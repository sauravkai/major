import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/ai-interview-platform',
  jwtSecret: process.env.JWT_SECRET || 'ai_interview_platform_super_secret_jwt_key_2026',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  vapiApiKey: process.env.VAPI_API_KEY || '',
  vapiAssistantId: process.env.VAPI_ASSISTANT_ID || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};
