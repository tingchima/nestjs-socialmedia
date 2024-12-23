import { Context } from "./context";

export class MyRequest extends Context {
  requestId: string;
}

export class ContextService {
  static setRequestId(requestId: string) {
    this.getContext().requestId = requestId;
  }

  static getRequestId(): string {
    return this.getContext().requestId;
  }

  static getContext(): MyRequest {
    return Context.current?.req;
  }
}
