import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const createLogger = () => {
  const options: Parameters<typeof pino>[0] = {
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
      level: (label) => ({ level: label }),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  };

  if (!isProduction) {
    options.transport = {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'SYS:standard' },
    };
  }

  return pino(options);
};

export const logger = createLogger();

// Helper for request-scoped logging (optional)
export const createRequestLogger = (req: { id: string }) => logger.child({ reqId: req.id });