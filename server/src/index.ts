import process from 'node:process';
import compression from 'compression';
import cors from 'cors';
import express, { type Express } from 'express';
import { env } from './config/env.js';
import { httpLogger, logger } from './config/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { chatRouter } from './routes/chat.js';
import { chromeExtensionsRouter } from './routes/chromeExtensions.js';
import { emailRouter } from './routes/email.js';

const main = () => {
  const app: Express = express();

  const corsOptions = {
    origin: env.FRONTEND_URL.split(',').map((url) => url.trim()),
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  // Enable gzip compression for all responses
  app.use(
    compression({
      level: 6, // Balanced compression level
      threshold: 1024, // Only compress responses > 1KB
      filter: (req, res) => {
        // Don't compress streaming responses
        if (req.path === '/api/chat/stream') {
          return false;
        }
        return compression.filter(req, res);
      },
    }),
  );

  app.use(cors(corsOptions));

  app.use(express.json());

  // Request timing middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const responseTime = Date.now() - start;
      httpLogger(req, res, responseTime);
    });
    next();
  });

  // Cache headers for static-like responses
  app.use((req, res, next) => {
    // Health check can be cached briefly
    if (req.path === '/health') {
      res.setHeader('Cache-Control', 'public, max-age=30');
    }
    next();
  });

  app.use('/api/chat', chatRouter);
  app.use('/api/email', emailRouter);
  app.use('/api/chrome-extension', chromeExtensionsRouter);

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  app.use(errorHandler);

  // Graceful shutdown
  const server = app.listen(env.PORT, () => {
    logger.info('server_started', { port: env.PORT, environment: env.NODE_ENV });
    logger.debug('cors_origins', { origins: env.FRONTEND_URL });
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('sigterm_received');
    server.close(() => {
      logger.info('server_closed');
      process.exit(0);
    });
  });
};

main();
