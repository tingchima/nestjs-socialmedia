import { Injectable, NestMiddleware } from "@nestjs/common";
import { Context } from "../context";

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    Context.cls.run(new Context(req, res), next);
  }
}
