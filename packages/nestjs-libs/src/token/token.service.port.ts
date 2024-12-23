import { Token, Claims } from "./types";

export abstract class TokenServicePort {
  abstract sign(payload: object): Token;
  abstract verify<T = Claims>(token: string): Promise<T | unknown>;
  abstract decode<T = Claims>(token: string): T | unknown;
}
