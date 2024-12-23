export interface ChatPublishPort {
  channelId: number;
  chat: any;
}

export interface ChatOnPublishPort {
  chat: any;
  publishAt: Date;
}

export interface ChatOnDeliveredPort {
  chat: string;
  deliveredAt: Date;
}

export interface ChatOnAckedPort {
  channelId: number;
  chatCreatedAt: Date;
  ackedAt: Date;
}
