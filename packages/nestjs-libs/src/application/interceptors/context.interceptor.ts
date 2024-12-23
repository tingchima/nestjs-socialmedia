import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { ContextService } from "../context/context.service";

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const requestId = request?.body?.requestId ?? uuidv4();

    ContextService.setRequestId(requestId);

    return next.handle().pipe(tap(() => {}));
  }
}
