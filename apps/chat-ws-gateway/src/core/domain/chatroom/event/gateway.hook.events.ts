import { ClientInfo } from "@core/domain/chatroom/value-object/client.info.value-object";

export class OnClientConnectedEvent {
  public readonly clientInfo: ClientInfo;

  constructor(clientInfo: ClientInfo) {
    this.clientInfo = clientInfo;
  }

  public static new(clientInfo: ClientInfo): OnClientConnectedEvent {
    return new OnClientConnectedEvent(clientInfo);
  }
}

export class OnClientDisconnectedEvent {
  public readonly clientInfo: ClientInfo;

  constructor(clientInfo: ClientInfo) {
    this.clientInfo = clientInfo;
  }

  public static new(clientInfo: ClientInfo): OnClientDisconnectedEvent {
    return new OnClientDisconnectedEvent(clientInfo);
  }
}

export class OnChatPublishEvent {
  public readonly channelId: number;
  public readonly chatCreatedAt: Date;
  public readonly publishAt: Date;

  constructor(channelId: number, chatCreatedAt: Date, publishAt: Date) {
    this.channelId = channelId;
    this.chatCreatedAt = chatCreatedAt;
    this.publishAt = publishAt;
  }

  public static new(by: {
    channelId: number;
    chatCreatedAt: Date;
    publishAt: Date;
  }): OnChatPublishEvent {
    return new OnChatPublishEvent(by.channelId, by.chatCreatedAt, by.publishAt);
  }
}

export class OnChatDeliveredEvent {
  public readonly channelId: number;
  public readonly chatCreatedAt: Date;
  public readonly deliveredAt: Date;

  constructor(channelId: number, chatCreatedAt: Date, deliveredAt: Date) {
    this.channelId = channelId;
    this.chatCreatedAt = chatCreatedAt;
    this.deliveredAt = deliveredAt;
  }

  public static new(by: {
    channelId: number;
    chatCreatedAt: Date;
    deliveredAt: Date;
  }): OnChatDeliveredEvent {
    return new OnChatDeliveredEvent(by.channelId, by.chatCreatedAt, by.deliveredAt);
  }
}

export class OnChatAckedEvent {
  public readonly channelId: number;
  public readonly chatCreatedAt: Date;
  public readonly ackedAt: Date;

  constructor(channelId: number, chatCreatedAt: Date, ackedAt: Date) {
    this.channelId = channelId;
    this.chatCreatedAt = chatCreatedAt;
    this.ackedAt = ackedAt;
  }

  public static new(by: {
    channelId: number;
    chatCreatedAt: Date;
    ackedAt: Date;
  }): OnChatAckedEvent {
    return new OnChatAckedEvent(by.channelId, by.chatCreatedAt, by.ackedAt);
  }
}
