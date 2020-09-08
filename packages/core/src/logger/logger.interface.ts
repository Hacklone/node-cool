
export interface Logger {
  verbose(message: string, data?: unknown): void;
  
  info(message: string, data?: unknown): void;

  error(error: Error, data?: unknown): void;
}