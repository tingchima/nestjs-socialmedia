export type IdentifierPort = number | string | undefined;

export abstract class EntityPort {
  abstract getId(): IdentifierPort;

  abstract validate(): Promise<void>;
}
