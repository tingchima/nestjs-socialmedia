import { HttpException } from "@nestjs/common";
import { AppException } from "./app.exception";

export type ErrorMessageType = {
  /**
   * message to be logged
   */
  message: string;
  /**
   * method or class that accour message
   */
  context?: string;
  /**
   * addtional object to log
   */
  obj?: object;
};

export type ErrorType = AppException | HttpException;

export interface ErrorCode {
  name: string;

  statusCode: number;

  message?: string;
}

export type ErrorParams = {
  code: ErrorCode;
  clientMessage?: string;
  cause?: Error;
  metadata?: unknown;
};

export interface SerializedException {
  name: string;
  clientMessage: string;
  traceId: string;
  timestamp: string;
  stack?: string;
  cause?: string;
  metadata?: unknown;
}
