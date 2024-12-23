import { HttpLogger } from "pino-http";
import { ErrorMessageType, ErrorType } from "../exception/types";

export abstract class LoggerServicePort<T extends HttpLogger = HttpLogger> {
  abstract pino: T;
  abstract connect(level: string): void;
  abstract setApplicationName(app: string): void;
  /**
   * @deprecated The method should be use only in main.ts, this log won't be saved in elastic, only sdout
   */
  abstract log(message: string): void;
  /**
   * this log won't be saved in elastic, only sdout
   */
  abstract trace({ message, context, obj }: ErrorMessageType): void;
  abstract info({ message, context, obj }: ErrorMessageType): void;
  abstract warn({ message, context, obj }: ErrorMessageType): void;
  abstract error(error: ErrorType, message?: string, context?: string): void;
  // abstract fatal(error: ErrorType, message?: string, context?: string): void;
}
