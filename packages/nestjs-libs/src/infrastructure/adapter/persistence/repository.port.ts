import { Optional } from "../../../core/type";
import { IdentifierPort } from "../../../core/entity";

export enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

export type OrderBy = {
  field?: string | true;
  order: Order;
};

export interface RepositoryPort<Entity> {
  create(entity: Entity): Promise<{ id: IdentifierPort }>;

  findOneById(id: IdentifierPort): Promise<Optional<Entity>>;

  removeById(id: IdentifierPort): Promise<boolean>;

  transaction<T>(callback: (tx: any) => Promise<T>): Promise<T>;
}

export type RepositoryFindOptions = {
  limit?: number;
  offset?: number;
  orderBy?: OrderBy;
  includeDeleted?: boolean;
};

export type RepositoryRemoveOptions = {
  enableSoftDeleting?: boolean;
};
