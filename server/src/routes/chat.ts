import {
  ASSISTANT_STREAM_DONE_EVENT,
  encodeAssistantSseEvent,
} from '@shared/portfolio/assistantStream.js';
import { type Request, type Response, Router } from 'express';
import OpenAI from 'openai';
import { createOpenAiAssistantProvider } from '../adapters/openAiAssistantProvider.js';
import { env } from '../config/env.js';
import { createPortfolioApiRuntime } from '../core/portfolioApiRuntime.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { chatRateLimiter, sttRateLimiter, ttsRateLimiter } from '../middleware/rateLimiter.js';
import { createHealthResponse } from '../utils/http.js';

export const chatRouter: Router = Router();

// Reuse OpenAI client instance (connection pooling)
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  maxRetries: 2,
  timeout: 30_000, // 30 second timeout
});
const assistantProvider = createOpenAiAssistantProvider(openai);
const apiRuntime = createPortfolioApiRuntime({ assistantProvider });

// Non-streaming endpoint with caching
chatRouter.post(
  '/',
  chatRateLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    const reply = await apiRuntime.createChatReply(req.body);

    res.setHeader('X-Cache', reply.cacheStatus);
    res.json({
      success: true,
      message: reply.message,
    });
  }),
);

// Streaming endpoint - optimized for faster time-to-first-byte
chatRouter.post(
  '/stream',
  chatRateLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    const replyStream = await apiRuntime.createChatReplyStream(req.body);

    // Set up streaming response headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    res.setHeader('X-Cache', replyStream.cacheStatus);

    // Flush headers immediately for faster TTFB
    res.flushHeaders();

    for await (const event of replyStream.events) {
      res.write(encodeAssistantSseEvent(event));
    }

    res.write(ASSISTANT_STREAM_DONE_EVENT);
    res.end();
  }),
);

// Health check with cache stats
chatRouter.get('/health', (_req: Request, res: Response) => {
  res.json(createHealthResponse(apiRuntime.getChatHealth()));
});

chatRouter.post(
  '/tts',
  ttsRateLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    const speech = await apiRuntime.createTextToSpeech(req.body);
    const buffer = Buffer.from(speech.audio);

    res.setHeader('Content-Type', speech.contentType);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', speech.cacheControl);
    res.send(buffer);
  }),
);

chatRouter.post(
  '/stt',
  sttRateLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    const chunks: Buffer[] = [];

    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const text = await apiRuntime.createSpeechToText({
      contentType: req.headers['content-type'] || '',
      audio: Buffer.concat(chunks),
    });

    res.json({
      success: true,
      text,
    });
  }),
);
