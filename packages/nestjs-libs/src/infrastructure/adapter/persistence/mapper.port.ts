import { Entity } from "../../../core/entity";

export interface Mapper<E extends Entity<any>, M> {
  toModel(entity: E): M;
  toDomainEntity(record: M): E;
}
