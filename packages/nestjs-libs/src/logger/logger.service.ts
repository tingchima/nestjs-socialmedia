import { Injectable, Scope } from "@nestjs/common";
import { DateTime } from "luxon";
import { multistream, pino } from "pino";
import { HttpLogger, pinoHttp } from "pino-http";
import pinoPretty from "pino-pretty";
import { LoggerServicePort } from "./logger.service.port";
import { ErrorMessageType, ErrorType } from "../exception/types";

@Injectable({ scope: Scope.REQUEST })
export class LoggerService implements LoggerServicePort {
  pino: HttpLogger;
  private appName: string;

  constructor(private readonly loggerServerUrl: string) {
    // TODO: logger server
  }

  connect(loggerLevel: string): void {
    const custom = {
      useLevelLabels: true,
      level: loggerLevel,
    };

    const stream = multistream([
      {
        level: "trace",
        stream: pinoPretty(this.getPinoConfig()),
      },
    ]);

    const pinoLogger = pino(custom, stream);

    this.pino = pinoHttp(pinoLogger);
  }

  setApplicationName(name: string): void {
    this.appName = name;
  }

  log(message: string): void {
    this.pino.logger.trace(message);
  }

  trace({ message, context, obj = {} }: ErrorMessageType): void {
    Object.assign(obj, { context });
    this.pino.logger.trace([obj, message].find(Boolean), message);
  }

  info({ message, context, obj = {} }: ErrorMessageType): void {
    Object.assign(obj, { context });
    this.pino.logger.info([obj, message].find(Boolean), message);
  }

  warn({ message, context, obj = {} }: ErrorMessageType): void {
    Object.assign(obj, { context });
    this.pino.logger.warn([obj, message].find(Boolean), message);
  }

  error(err: ErrorType, message?: string, context?: string): void {
    // const errorResponse = this.getErrorResponse(err);
    // const response =
    //   err?.name === AppException.name
    //     ? {
    //         statusCode: (err as AppException).statusCode,
    //         message: err?.message,
    //       }
    //     : errorResponse?.value();
    // const type = {
    //   Error: AppException.name,
    // }[err?.name];
    // this.pino.logger.error(
    //   {
    //     ...response,
    //     context: [context, this.appName].find(Boolean),
    //     type: [type, err?.name].find(Boolean),
    //     traceid: this.getTraceId(err),
    //     timestamp: this.getDateFormat(),
    //     application: this.appName,
    //     stack: err.stack,
    //   },
    //   message,
    // );
  }

  // fatal(err: ErrorType, message?: string, context?: string): void {
  //   this.pino.logger.fatal(
  //     {
  //       ...(err.getResponse() as object),
  //       context: [context, this.appName].find(Boolean),
  //       type: err.name,
  //       traceid: this.getTraceId(err),
  //       timestamp: this.getDateFormat(),
  //       application: this.appName,
  //       stack: err.stack,
  //     },
  //     message,
  //   );
  // }

  // private getErrorResponse(err: ErrorType): any {
  //   const isFunction = typeof err?.getResponse === "function";
  //   return [
  //     {
  //       conditional: typeof err === "string",
  //       value: () => new InternalServerErrorException(err).getResponse(),
  //     },
  //     {
  //       conditional: isFunction && typeof err.getResponse() === "string",
  //       value: () => {
  //         new AppException(
  //           err.getResponse(),
  //           [err.getStatus(), err.getStatus()].find(Boolean),
  //           err instanceof AppException
  //             ? (err as AppException).context
  //             : undefined,
  //         ).getResponse();
  //       },
  //     },
  //     {
  //       conditional: isFunction && typeof err.getResponse() === "object",
  //       value: () => err?.getResponse(),
  //     },
  //     {
  //       conditional: [
  //         err?.name === Error.name,
  //         err?.name === TypeError.name,
  //       ].some(Boolean),
  //       value: () =>
  //         new InternalServerErrorException(err.message).getResponse(),
  //     },
  //   ].find((c) => c.conditional);
  // }

  private getDateFormat(
    date = new Date(),
    format = "dd/MM/yyyy HH:mm:ss",
  ): string {
    return DateTime.fromJSDate(date).toFormat(format);
  }

  private getTraceId(err: any): string {
    // if (typeof err === "string") return nanoid(6);
    return [err.traceId, this.pino.logger.bindings()?.tranceId].find(Boolean);
  }

  private getPinoConfig() {
    return {
      levelFirst: true,
      ignore: "pid,hostname",
      quietReqLogger: true,
      messageFormat: (log: any, messageKey: string) => {
        const message = log[String(messageKey)];
        if (this.appName) {
          return `[${this.appName}] ${message}`;
        }
        return message;
      },
      customPrettifiers: {
        time: () => {
          return `[${this.getDateFormat()}]`;
        },
      },
    };
  }
}
