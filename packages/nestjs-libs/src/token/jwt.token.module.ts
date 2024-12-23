// import { Module } from "@nestjs/common";

// import { TokenServicePort } from "./token.service.port";
// import { JwtTokenService } from "./jwt.token.service";
// import { ConfigServicePort } from "../infrastructure/config/config.service.port";

// @Module({
//   providers: [
//     {
//       provide: TokenServicePort,
//       useFactory: (svc: ConfigServicePort) => new JwtTokenService(svc),
//     },
//   ],
//   exports: [TokenServicePort],
// })
// export class JwtTokenModule {}
