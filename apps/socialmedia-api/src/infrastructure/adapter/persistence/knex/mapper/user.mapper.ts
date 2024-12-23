import { Injectable } from "@nestjs/common";

import { UserEntity } from "@core/domain/user/entity/user.entity";
import { UserModel } from "@infrastructure/adapter/persistence/knex/model/user.model";
import { Mapper } from "@repo/nestjs-libs";
import { userRoleFromString } from "@core/domain/user/entity/enum/user.enum";

@Injectable()
export class UserMapper implements Mapper<UserEntity, UserModel> {
  toModel(entity: UserEntity): UserModel {
    return {
      email: entity.getEmail(),
      display_name: entity.getName(),
      password: entity.getPassword(),
      avatar_path: entity.getAvatarPath(),
      enabled: entity.getEnabled(),
      role: entity.getRole().toString(),
      created_at: entity.getCreatedAt(),
      updated_at: entity.getUpdatedAt() as Date,
    };
  }

  toModels(entities: UserEntity[]): UserModel[] {
    return entities.map((item) => this.toModel(item));
  }

  toDomainEntity(record: UserModel): UserEntity {
    return new UserEntity({
      id: record.id,
      email: record.email,
      dieplayName: record.display_name,
      password: record.password,
      avatarPath: record.avatar_path,
      enabled: record.enabled,
      role: userRoleFromString(record.role),
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    });
  }

  toDomainEntities(records: UserModel[]): UserEntity[] {
    return records.map((item) => this.toDomainEntity(item));
  }
}
