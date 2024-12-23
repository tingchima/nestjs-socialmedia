import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { LoggerServicePort } from "../../logger/logger.service.port";

@Injectable()
export class AccessLogInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerServicePort) {}
  intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request = executionContext.switchToHttp().getRequest();
    const response = executionContext.switchToHttp().getResponse();

    request.context = `${executionContext.getClass().name}/${executionContext.getHandler().name}`;

    // if (!request.headers?.traceId) {
    //   request.headers.traceId = uuidv4();
    // }

    this.loggerService.pino(request, response);
    return next.handle();
  }
}
