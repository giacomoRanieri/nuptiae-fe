// lib/logger.ts

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

// In production logging only from 'warn' (2) up.
// In development logging everything (from 'debug' up).
const CURRENT_LOG_LEVEL = process.env.NODE_ENV === 'production' ? 2 : 0;

export const logger = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug: (msg: string, ...args: any[]) => {
        if (LOG_LEVELS.debug >= CURRENT_LOG_LEVEL) {
            console.debug(`[DEBUG] ${msg}`, ...args);
        }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: (msg: string, ...args: any[]) => {
        if (LOG_LEVELS.info >= CURRENT_LOG_LEVEL) {
            console.info(`[INFO] ${msg}`, ...args);
        }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn: (msg: string, ...args: any[]) => {
        if (LOG_LEVELS.warn >= CURRENT_LOG_LEVEL) {
            console.warn(`[WARN] ${msg}`, ...args);
        }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: (msg: string, ...args: any[]) => {
        if (LOG_LEVELS.error >= CURRENT_LOG_LEVEL) {
            console.error(`[ERROR] ${msg}`, ...args);
        }
    },
};