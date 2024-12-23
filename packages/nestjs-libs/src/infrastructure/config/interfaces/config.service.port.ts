export abstract class ConfigServicePort {
  APP_NAME: string;

  ENV: string;

  PORT: number;

  GRPC_PORT: number;

  JWT: {
    ISSUER: string;
    SECRET: string;
    EXPIRES_IN_SEC: string;
  };

  BASIC: {
    USERNAME_FIELD: string;
    PASSWORD_FIELD: string;
  };

  DATABASE: {
    CLIENT: string;
    HOST: string;
    PORT: number;
    USER: string;
    PASSWORD: string;
    NAME: string;
  };

  AWS: {
    REGION: string;
    ENDPOINT: string;
  };

  BUCKET: {
    NAME: string;
    PRESINGED_EXPIRES_IN_SEC: number;
  };

  CACHE: {
    HOST: string;
    PORT: number;
    USERNAME: string;
    PASSWORD: string;
    DATABASE: number;
  };

  ELASTICSEARCH: {
    NODES: string;
  };

  GRPC_SERVER: {
    SOCIALMEDIA_API_URL: string;
    CHAT_WS_GATEWAY_URL_ASIA: string;
    CHAT_WS_GATEWAY_URL_NA: string;
  };
}
