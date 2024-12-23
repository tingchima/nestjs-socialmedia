// import { HttpStatus, Injectable } from "@nestjs/common";
// import * as jwt from "jsonwebtoken";

// import { TokenServicePort } from "./token.service.port";
// import { Claims, Token } from "./types";
// import { ConfigServicePort } from "../infrastructure/config/config.service.port";
// import { AppException } from "../exceptions/app.exception";

// @Injectable()
// export class JwtTokenService implements TokenServicePort {
//   constructor(private readonly configService: ConfigServicePort) {}

//   /*
//   註冊聲明參數 (建議但不強制使用)
//   aud (Audience) - 接收jwt的一方 ("https://consumer.example.com")
//   iss (Issuer) - jwt簽發者 ("https://issuer.example.com")
//   exp (Expiration Time) - jwt的過期時間 (1443904177)
//   sub (Subject) - jwt所面向的用戶 (dgaf4mvfs75Fci_FL3heQA)
//   iat (Issued At) - jwt的簽發時間 (1443904100)
//   scope - 存取權限 (email profile phone address)
//   */
//   sign(payload: object): Token {
//     const jwtConfig = this.configService.JWT;

//     const accessToken = jwt.sign(payload, jwtConfig.SECRET, {
//       issuer: jwtConfig.ISSUER,
//       expiresIn: jwtConfig.EXPIRES_IN_SEC,
//     });

//     const refreshToken = jwt.sign(payload, jwtConfig.SECRET, {
//       issuer: jwtConfig.ISSUER,
//       expiresIn: jwtConfig.EXPIRES_IN_SEC,
//     });

//     return { access: accessToken, refresh: refreshToken };
//   }

//   async verify<Claims>(token: string): Promise<Claims | unknown> {
//     return new Promise((resolve, reject) => {
//       jwt.verify(token, this.configService.JWT.SECRET, (err, decoded) => {
//         if (err) {
//           const exception = new AppException(
//             err.clientMessage,
//             HttpStatus.UNAUTHORIZED,
//             `${JwtTokenService.name}/${this.verify.name}`,
//           );
//           reject(exception);
//         }
//         resolve(decoded as Claims | unknown);
//       });
//     });
//   }

//   decode(token: string): Claims | unknown {
//     const jwtPayload = jwt.decode(token);
//     return jwtPayload as Claims | unknown;
//   }
// }
