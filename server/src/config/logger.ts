import { Effect } from 'effect';

type HttpRequest = {
  method: string;
  url: string;
  ip?: string;
};

type HttpResponse = {
  statusCode: number;
};

type LogMetadata = Record<string, unknown>;

type Logger = {
  debug: (event: string, metadata?: LogMetadata) => void;
  info: (event: string, metadata?: LogMetadata) => void;
  warn: (event: string, metadata?: LogMetadata) => void;
  error: (event: string, metadata?: LogMetadata) => void;
};

const runLog = (program: Effect.Effect<void>): void => {
  Effect.runSync(program);
};

const writeLog =
  (level: 'Debug' | 'Info' | 'Warning' | 'Error') =>
  (event: string, metadata: LogMetadata = {}): void => {
    runLog(
      Effect[`log${level}`](event).pipe(
        Effect.annotateLogs({
          ...metadata,
          event,
        }),
      ),
    );
  };

export const logger: Logger = {
  debug: writeLog('Debug'),
  info: writeLog('Info'),
  warn: writeLog('Warning'),
  error: writeLog('Error'),
};

export const httpLogger = (req: HttpRequest, res: HttpResponse, responseTime: number): void => {
  const log = res.statusCode >= 400 ? logger.warn : logger.info;

  log('http_request', {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime,
  });
};
