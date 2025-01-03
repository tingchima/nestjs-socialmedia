// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.4.1
//   protoc               v3.20.3
// source: chat_ws_gateway/v1/chat_service.proto

/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Empty } from "../../google/protobuf/empty.pb";
import { Timestamp } from "../../google/protobuf/timestamp.pb";

export const protobufPackage = "chat_ws_gateway.v1";

export enum PublishStatus {
  UNSPECIFIED = "UNSPECIFIED",
  SUCCESS = "SUCCESS",
  FAIL = "FAIL",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export interface PublishChatRequest {
  channelId: number;
  chat: Chat | undefined;
}

export interface PublishChatResponse {
  channelId: number;
  publishStatus: PublishStatus;
}

export interface Chat {
  createdAt: Timestamp | undefined;
  channelId: number;
  text: string;
}

export interface Subscribe {
  topic: string;
  clientId: string;
}

export interface SubscribeBulkRequest {
  subscribes: Subscribe[];
}

export const CHAT_WS_GATEWAY_V1_PACKAGE_NAME = "chat_ws_gateway.v1";

export interface ChatServiceClient {
  publishChat(request: Observable<PublishChatRequest>, metadata?: Metadata): Observable<PublishChatResponse>;

  subscribeBulk(request: SubscribeBulkRequest, metadata?: Metadata): Observable<Empty>;
}

export interface ChatServiceController {
  publishChat(request: Observable<PublishChatRequest>, metadata?: Metadata): Observable<PublishChatResponse>;

  subscribeBulk(request: SubscribeBulkRequest, metadata?: Metadata): void;
}

export function ChatServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["subscribeBulk"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ChatService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = ["publishChat"];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ChatService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const CHAT_SERVICE_NAME = "ChatService";
