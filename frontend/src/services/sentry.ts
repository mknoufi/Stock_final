import { createLogger } from "./logging";

const log = createLogger("sentry");
let sentryModule: any = null;
let sentryInitAttempted = false;

export interface CaptureContext {
  context?: string;
  message?: string;
  [key: string]: unknown;
}

export const initSentry = async () => {
  if (sentryInitAttempted) return;
  sentryInitAttempted = true;

  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    log.info("Sentry DSN not configured; error reporting will use fallback logging");
    return;
  }

  try {
    const sentryPackage = "@sentry/react-native";
    const mod = await import(sentryPackage);
    mod.init({
      dsn,
      environment: process.env.NODE_ENV || "development",
    });
    sentryModule = mod;
    log.info("Sentry initialized");
  } catch (error) {
    log.warn("Sentry SDK unavailable; continuing with fallback logging", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const captureException = (error: Error, context?: CaptureContext) => {
  if (sentryModule?.captureException) {
    sentryModule.captureException(error, { extra: context || {} });
    return;
  }
  log.error("Captured exception", {
    error: error.message,
    context,
  });
};
