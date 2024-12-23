import { Optional } from "@repo/nestjs-libs";
import { WsClientEntity } from "@core/domain/chatroom/entity/user.gateway.entity";

export interface WsGatewayLocationRepositoryPort {
  createGatewayLocation(
    by: { clientId: string; location: string },
    expiresIn: number,
  ): Promise<void>;

  deleteGatewayLocaiton(by: { clientId: string }): Promise<void>;

  getGatewayLocation(by: { clientId: string }): Promise<Optional<WsClientEntity>>;

  getLocationList(by: { clientIds: string[] }): Promise<symbol[]>;
}
