import * as path from 'path';
import * as fs from 'fs';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
//import { DailyRotateFile } from 'winston/lib/winston/transports';

/**
 * Log levels enum
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * Winston Logger utility class
 * Provides comprehensive logging with console and file output
 */
class LoggerUtils {
  private static instance: LoggerUtils;
  private winstonLogger: winston.Logger;
  private logDir: string;

  private constructor() {
    this.logDir = process.env.LOG_DIR || './logs';
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }

    // Define log format
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    );

    // Define console format (more readable)
    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
        const contextStr = context ? ` [${context}]` : '';
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] ${level}${contextStr} ${message}${metaStr}`;
      })
    );

    // Get log level from environment or default to 'info'
    const logLevel = (process.env.LOG_LEVEL || 'info').toLowerCase();

    // Create Winston logger
    this.winstonLogger = winston.createLogger({
      level: logLevel,
      format: logFormat,
      defaultMeta: { service: 'playwright-automation' },
      transports: [
        // Console transport
        new winston.transports.Console({
          format: consoleFormat,
          level: logLevel
        }),
        // File transport for all logs
        new winston.transports.File({
          filename: path.join(this.logDir, 'combined.log'),
          format: logFormat,
          maxsize: 5242880, // 5MB
          maxFiles: 5
        }),
        // File transport for errors only
        new winston.transports.File({
          filename: path.join(this.logDir, 'error.log'),
          format: logFormat,
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5
        })
      ]
    });

    // Add daily rotate file transport if needed
      this.winstonLogger.add(new DailyRotateFile({
        filename: path.join(this.logDir, 'test-%DATE%.log'),
        format: logFormat,
        datePattern: 'YYYY-MM-DD',
         maxSize: '5m',
         maxFiles: '14d',
      }));
    
  }

  /**
   * Get singleton instance of Logger
   */
  public static getInstance(): LoggerUtils {
    if (!LoggerUtils.instance) {
      LoggerUtils.instance = new LoggerUtils();
    }
    return LoggerUtils.instance;
  }

  /**
   * Log debug message
   */
  public debug(message: string, context?: string): void {
    this.winstonLogger.debug(message, { context });
  }

  /**
   * Log info message
   */
  public info(message: string, context?: string): void {
    this.winstonLogger.info(message, { context });
  }

  /**
   * Log warning message
   */
  public warn(message: string, context?: string): void {
    this.winstonLogger.warn(message, { context });
  }

  /**
   * Log error message
   */
  public error(message: string, error: Error | unknown, context?: string): void {
    const errorMeta: any = { context };
    
    if (error instanceof Error) {
      errorMeta.error = {
        message: error.message,
        stack: error.stack,
        name: error.name
      };
    } else if (error) {
      errorMeta.error = String(error);
    }
    
    this.winstonLogger.error(message, errorMeta);
  }

  /**
   * Log method error
   */
  public logMethodError(methodName: string, error: Error | unknown, context?: string): void {
    this.error(`Error in method: ${methodName}`, error, context);
  }

  /**
   * Set log level
   */
  public setLogLevel(level: string): void {
    this.winstonLogger.level = level;
  }

}

/**
 * Export singleton instance for easy access
 */
export const logger = LoggerUtils.getInstance();
