import { Module, Provider } from "@nestjs/common";

import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { ChatServiceClientManager } from "@infrastructure/adapter/server/grpc/chat.service.client.service";
import { ChannelController } from "@application/api-route/http/v1/controller/channel.controller";
import { ChannelService } from "@core/service/chatroom/channel.service";
import { ChatController } from "@application/api-route/http/v1/controller/chat.controller";
import { ChatService } from "@core/service/chatroom/chat.service";
import { ChatMapper } from "@infrastructure/adapter/persistence/aws-dynamodb/mapper/chat.mapper";
import { AwsDynamoDBChatRepositoryAdapter } from "@infrastructure/adapter/persistence/aws-dynamodb/repository/aws.dynamodb.chat.repository.adapter";
import { ChannelMapper } from "@infrastructure/adapter/persistence/knex/mapper/channel.mapper";
import { KnexChannelRepositoryAdapter } from "@infrastructure/adapter/persistence/knex/repository/knex.channel.repository.adapter";
import { KnexMemberRepositoryAdapter } from "@infrastructure/adapter/persistence/knex/repository/knex.member.repository.adapter";
import { MemberMapper } from "@infrastructure/adapter/persistence/knex/mapper/member.mapper";
import { MemberController } from "@application/api-route/http/v1/controller/member.controller";
import { MemberService } from "@core/service/chatroom/member.service";
import { SubscriptionRepositoryAdapter } from "@infrastructure/adapter/cache/redis/repository/subscription.repository.adapter";
import { GrpcGatewayHookServiceController } from "@application/api-route/grpc/v1/controller/grpc.gateway.hook.service.controller";
import { WsGatewayLocationRepositoryAdapter } from "@infrastructure/adapter/cache/redis/repository/ws.gateway.location.repository.adapter";
import { ConfigModule } from "@repo/nestjs-libs";
import { WsLocationKeyNameHelperService } from "@core/service/chatroom/helper/ws.location.key.name.helper.service";
import { MemberExistsHelperService } from "@core/service/chatroom/helper/member.exists.helper.service";
import { ElasticsearchChatRepositoryAdapter } from "@infrastructure/adapter/persistence/elasticsearch/repository/elasticsearch.chat.repository.adapter";

const persistenceProviders: Provider[] = [
  {
    provide: ChatroomInjectTokens.CHAT_REPOSITORY,
    useClass: AwsDynamoDBChatRepositoryAdapter,
  },
  {
    provide: ChatroomInjectTokens.CHANNEL_REPOSITORY,
    useClass: KnexChannelRepositoryAdapter,
  },
  {
    provide: ChatroomInjectTokens.MEMBER_REPOSITORY,
    useClass: KnexMemberRepositoryAdapter,
  },
  {
    provide: ChatroomInjectTokens.CHAT_SEARCH_REPOSITORY,
    useClass: ElasticsearchChatRepositoryAdapter,
  },
];

const mapperProviders: Provider[] = [
  {
    provide: ChatroomInjectTokens.CHAT_MAPPER,
    useClass: ChatMapper,
  },
  {
    provide: ChatroomInjectTokens.CHANNEL_MAPPER,
    useClass: ChannelMapper,
  },
  {
    provide: ChatroomInjectTokens.MEMBER_MAPPER,
    useClass: MemberMapper,
  },
];

const cacheProviders: Provider[] = [
  {
    provide: ChatroomInjectTokens.SUBSCRIPTION_REPOSITORY,
    useClass: SubscriptionRepositoryAdapter,
  },
  {
    provide: ChatroomInjectTokens.WS_CLIENT_REPOSITORY,
    useClass: WsGatewayLocationRepositoryAdapter,
  },
];

const serverProviders: Provider[] = [
  {
    provide: ChatroomInjectTokens.CHAT_SEVICE_CLIENT_MANAGER,
    useClass: ChatServiceClientManager,
  },
];

const helperProviders: Provider[] = [WsLocationKeyNameHelperService, MemberExistsHelperService];

const useCaseProviders: Provider[] = [
  {
    provide: ChatroomInjectTokens.CHANNEL_USE_CASE,
    useClass: ChannelService,
  },
  {
    provide: ChatroomInjectTokens.CHAT_USE_CASE,
    useClass: ChatService,
  },
  {
    provide: ChatroomInjectTokens.MEMBER_USE_CASE,
    useClass: MemberService,
  },
];

@Module({
  imports: [ConfigModule],
  controllers: [
    GrpcGatewayHookServiceController,
    ChannelController,
    MemberController,
    ChatController,
  ],
  providers: [
    ...mapperProviders,
    ...persistenceProviders,
    ...cacheProviders,
    ...serverProviders,
    ...useCaseProviders,
    ...helperProviders,
  ],
})
export class ChatroomModule {}
