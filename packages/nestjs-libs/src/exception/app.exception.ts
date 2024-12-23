import { DateTime } from "luxon";

import { ContextService } from "../application/context";
import { Optional } from "../core/type";
import { ErrorCode, ErrorParams, SerializedException } from "./types";

export class AppException extends Error {
  public readonly statusCode: number;

  public readonly traceId: string;

  public readonly metadata: Optional<unknown>;

  constructor(errCode: ErrorCode, clientMessage?: string, cause?: Error, metadata?: unknown) {
    super();
    this.name = errCode.name;
    this.message = clientMessage || errCode.name;
    this.cause = cause;
    this.metadata = metadata;
    this.statusCode = errCode.statusCode;
    this.traceId = ContextService.getContext()?.requestId;
    Error.captureStackTrace(this, this.constructor);
  }

  public static new(params: ErrorParams): AppException {
    return new AppException(params.code, params.clientMessage, params.cause, params.metadata);
  }

  public toJSON(): SerializedException {
    return {
      name: this.name,
      clientMessage: this.message,
      stack: this.stack,
      traceId: this.traceId,
      timestamp: DateTime.fromJSDate(new Date()).toFormat("dd/MM/yyyy HH:mm:ss"),
      cause: JSON.stringify(this.cause),
      metadata: this.metadata,
    };
  }
}
