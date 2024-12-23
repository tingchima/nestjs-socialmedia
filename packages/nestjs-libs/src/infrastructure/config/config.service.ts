import { Injectable } from "@nestjs/common";
import { ConfigService as NestjsConfigService } from "@nestjs/config";
import { ConfigServicePort } from "./interfaces/config.service.port";

@Injectable()
export class ConfigService extends NestjsConfigService implements ConfigServicePort {
  constructor() {
    super();
  }

  APP_NAME = this.get("APP_NAME");

  ENV = this.get("ENV");

  PORT = this.get("PORT");

  GRPC_PORT = this.get("GRPC_PORT");

  JWT = {
    ISSUER: this.get("JWT_ISSUER"),
    SECRET: this.get("JWT_SECRET"),
    EXPIRES_IN_SEC: this.get("JWT_EXPIRES_IN_SEC"),
  };

  BASIC = {
    USERNAME_FIELD: this.get("BASIC_USERNAME_FIELD"),
    PASSWORD_FIELD: this.get("BASIC_PASSWORD_FIELD"),
  };

  DATABASE = {
    CLIENT: this.get("DATABASE_CLIENT"),
    HOST: this.get("DATABASE_HOST"),
    PORT: this.get("DATABASE_PORT"),
    USER: this.get("DATABASE_USER"),
    PASSWORD: this.get("DATABASE_PASSWORD"),
    NAME: this.get("DATABASE_NAME"),
  };

  AWS = {
    REGION: this.get("AWS_REGION"),
    ENDPOINT: this.get("AWS_ENDPOINT"),
  };

  BUCKET = {
    NAME: this.get("BUCKET_NAME"),
    PRESINGED_EXPIRES_IN_SEC: this.get("BUCKET_PRESINGED_EXPIRES_IN_SEC"),
  };

  CACHE = {
    HOST: this.get("CACHE_HOST"),
    PORT: this.get("CACHE_PORT"),
    DATABASE: this.get("CACHE_DATABASE"),
    USERNAME: this.get("CACHE_USERNAME"),
    PASSWORD: this.get("CACHE_PASSWORD"),
  };

  ELASTICSEARCH = {
    NODES: this.get("ELASTICSEARCH_NODES"),
  };

  GRPC_SERVER = {
    SOCIALMEDIA_API_URL: this.get("GRPC_SERVER_SOCIALMEDIA_API_URL"),
    CHAT_WS_GATEWAY_URL_ASIA: this.get("GRPC_SERVER_CHAT_WS_GATEWAY_URL_ASIA"),
    CHAT_WS_GATEWAY_URL_NA: this.get("GRPC_SERVER_CHAT_WS_GATEWAY_URL_NA"),
  };
}
