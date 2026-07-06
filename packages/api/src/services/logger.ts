import * as Sentry from "@sentry/node";

export const logger = {
  info: (message: string, context?: Record<string, any>) => {
    console.log(JSON.stringify({ level: "info", message, ...context }));
  },

  error: (message: string, context?: Record<string, any>) => {
    console.error(JSON.stringify({ level: "error", message, ...context }));
    if (context?.error instanceof Error) {
      Sentry.captureException(context.error);
    }
  },

  warn: (message: string, context?: Record<string, any>) => {
    console.warn(JSON.stringify({ level: "warn", message, ...context }));
  },

  debug: (message: string, context?: Record<string, any>) => {
    if (process.env.DEBUG) {
      console.debug(JSON.stringify({ level: "debug", message, ...context }));
    }
  },
};