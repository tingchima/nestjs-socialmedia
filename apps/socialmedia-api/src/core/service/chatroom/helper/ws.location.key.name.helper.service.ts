import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { Injectable } from "@nestjs/common";
import { AppException, ConfigServicePort, ResourceNotFound } from "@repo/nestjs-libs";

@Injectable()
export class WsLocationKeyNameHelperService {
  constructor(private readonly configService: ConfigServicePort) {}

  public resolve(address: string): { location: string; locationSymbol: symbol } {
    const { CHAT_WS_GATEWAY_URL_ASIA, CHAT_WS_GATEWAY_URL_NA } = this.configService.GRPC_SERVER;

    switch (address) {
      case CHAT_WS_GATEWAY_URL_ASIA:
        return {
          location: Symbol.keyFor(ChatroomInjectTokens.CHAT_SEVICE_ASIA) || "",
          locationSymbol: ChatroomInjectTokens.CHAT_SEVICE_ASIA,
        };
      case CHAT_WS_GATEWAY_URL_NA:
        return {
          location: Symbol.keyFor(ChatroomInjectTokens.CHAT_SEVICE_NA) || "",
          locationSymbol: ChatroomInjectTokens.CHAT_SEVICE_NA,
        };
      default:
        throw AppException.new({
          code: ResourceNotFound,
          clientMessage: `specifeid web socket gateway address ${address} is not found`,
        });
    }
  }
}
