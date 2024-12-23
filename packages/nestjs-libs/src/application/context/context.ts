import { AsyncLocalStorage } from "async_hooks";

export type Request = any;

export type Reponse = any;

export class Context {
  static cls = new AsyncLocalStorage<Context>();

  constructor(
    public readonly req: Request,
    public readonly resp: Reponse,
  ) {}

  static get current() {
    return this.cls.getStore();
  }
}
