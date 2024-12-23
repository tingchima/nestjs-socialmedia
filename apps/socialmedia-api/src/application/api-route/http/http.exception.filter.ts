import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

import { AppException, LoggerServicePort } from "@repo/nestjs-libs";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerServicePort) {}

  catch(exception: Error, host: ArgumentsHost): void {
    // const request: Request = host.switchToHttp().getRequest<Request>();
    const response: Response = host.switchToHttp().getResponse<Response>();

    let errorResponse: any;
    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errorResponse = exception;
    }

    if (exception instanceof AppException) {
      statusCode = exception.statusCode;
      errorResponse = exception.toJSON();
    }

    // this.loggerService.error(exception, exception.message, exception.context);

    response.status(statusCode).json(errorResponse);
  }
}
