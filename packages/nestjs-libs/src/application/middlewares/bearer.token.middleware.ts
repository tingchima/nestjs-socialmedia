import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { TokenServicePort } from "../../token/token.service.port";
import { LoggerServicePort } from "../../logger/logger.service.port";
import { Claims } from "../../token/types";

@Injectable()
export class BearerTokenMiddlewasre implements NestMiddleware {
  constructor(
    private readonly tokenService: TokenServicePort,
    private readonly loggerService: LoggerServicePort,
  ) {}

  async use(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    /**
     * Authorization: Bearer Token_Value
     */

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      if (!request.headers?.traceid) {
        request.headers.traceid = uuidv4();
      }
      response.status(HttpStatus.PRECONDITION_FAILED);
      this.loggerService.pino(request, response);
      throw new UnauthorizedException("token is empty");
    }

    const token = authHeader.split(" ")[1];

    const claims: Claims | unknown = await this.tokenService
      .verify(token)
      .catch((err) => {
        this.loggerService.pino(request, response);
        next(err);
      });

    request.headers.user = (claims as Claims).userId;

    next();
  }
}
