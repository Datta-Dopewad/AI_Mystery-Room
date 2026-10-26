import 'dotenv/config';

const clientOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI,
  geminiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  geminiFallbackModels: (process.env.GEMINI_FALLBACK_MODELS || 'gemini-3.6-flash,gemini-3.5-flash-lite')
    .split(',').map(model => model.trim()).filter(Boolean),
  geminiRequestTimeoutMs: Number(process.env.GEMINI_REQUEST_TIMEOUT_MS || 30000),
  clientOrigins,
  maxScenario: Number(process.env.MAX_SCENARIO_LENGTH || 2000),
};
