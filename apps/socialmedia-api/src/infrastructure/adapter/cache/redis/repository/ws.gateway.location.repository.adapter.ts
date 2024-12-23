import { Inject, Injectable } from "@nestjs/common";
import { RedisClientType } from "redis";

import {
  AppException,
  InternalServerError,
  Nullable,
  Optional,
  RedisInjectTokens,
} from "@repo/nestjs-libs";
import { WsGatewayLocationRepositoryPort } from "@core/domain/chatroom/interface/ws.gateway.location.repository.port";
import { WsClientEntity } from "@core/domain/chatroom/entity/user.gateway.entity";

@Injectable()
export class WsGatewayLocationRepositoryAdapter implements WsGatewayLocationRepositoryPort {
  constructor(@Inject(RedisInjectTokens.REDIS_CLIENT) private readonly client: RedisClientType) {}

  private getKey(clientId: string): string {
    return `ws:locaitons:${clientId}`;
  }

  public async createGatewayLocation(
    by: { clientId: string; location: string },
    expiresIn: number,
  ): Promise<void> {
    const key = this.getKey(by.clientId);

    try {
      await this.client.set(key, by.location);
      await this.client.expire(key, expiresIn);
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async deleteGatewayLocaiton(by: { clientId: string }): Promise<void> {
    const key = this.getKey(by.clientId);

    try {
      await this.client.del(key);
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async getGatewayLocation(by: { clientId: string }): Promise<Optional<WsClientEntity>> {
    const key = this.getKey(by.clientId);

    let entity: Optional<WsClientEntity>;

    try {
      const node: Nullable<string> = await this.client.get(key);

      if (node) {
        entity = new WsClientEntity({ clientId: by.clientId, fromNode: node });
      }

      return entity;
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async getLocationList(by: { clientIds: string[] }): Promise<symbol[]> {
    const keys = by.clientIds.map((clientId) => this.getKey(clientId));

    try {
      const nodes: Nullable<string>[] = await this.client.mGet(keys);
      return [...new Set(nodes.filter((node) => node !== null).map((node) => Symbol.for(node)))];
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }
}
