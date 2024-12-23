import { GrpcService } from "@nestjs/microservices";
import { Observable, Subject } from "rxjs";

import { ChatServiceV1 as pb } from "@repo/grpc";
import { Inject } from "@nestjs/common";
import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { SubscriptionUseCase } from "@core/domain/chatroom/interface/subscription.use-case";
import { SubscribeBulkAdapter } from "@infrastructure/adapter/use-case/subscription.user-case.adapter";
import { ChatUseCase } from "@core/domain/chatroom/interface/chat.use-case";
import { ChatPublishAdapter } from "@infrastructure/adapter/use-case/chat.use-case.adapter";

@GrpcService()
@pb.ChatServiceControllerMethods()
export class GrpcChatServiceController implements pb.ChatServiceController {
  constructor(
    @Inject(ChatroomInjectTokens.SUBSCRIPTION_USE_CASE)
    private readonly subscriptionUseCase: SubscriptionUseCase,

    @Inject(ChatroomInjectTokens.CHAT_USE_CASE)
    private readonly chtuseCase: ChatUseCase,
  ) {}

  publishChat(request: Observable<pb.PublishChatRequest>): Observable<pb.PublishChatResponse> {
    const subject = new Subject<pb.PublishChatResponse>();

    const onNext = async (req: pb.PublishChatRequest) => {
      const adapter: ChatPublishAdapter = await ChatPublishAdapter.new({
        channelId: req.channelId,
        chat: req.chat,
      });

      await this.chtuseCase.publishChat(adapter);

      subject.next({
        channelId: req.channelId,
        publishStatus: pb.PublishStatus.SUCCESS,
      });
    };

    const onComplete = () => subject.complete();

    request.subscribe({ next: onNext, complete: onComplete });
    return subject.asObservable();
  }

  public async subscribeBulk(request: pb.SubscribeBulkRequest) {
    const adapter: SubscribeBulkAdapter = await SubscribeBulkAdapter.new({
      subscribes: request.subscribes,
    });

    await this.subscriptionUseCase.subscribeBulkTopic(adapter);
  }
}
