import mongoose from 'mongoose';
import app from './app.js';
import { env } from './config/env.js';

try {
  if (!env.mongoUri) throw Error('MONGODB_URI is required. Copy server/.env.example to server/.env and configure it.');
  if (env.nodeEnv === 'production' && !env.geminiKey) throw Error('GEMINI_API_KEY is required in production.');
  if (env.nodeEnv === 'production' && env.clientOrigins.length === 0) throw Error('CLIENT_ORIGIN must include the deployed frontend origin.');

  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
  app.listen(env.port, '0.0.0.0', () => console.log(`Mystery Room API listening on ${env.port}`));
} catch (error) {
  console.error(`Startup failed: ${error.message}`);
  process.exit(1);
}
