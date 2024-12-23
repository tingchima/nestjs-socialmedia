import { HttpStatus } from "@nestjs/common";
import { ErrorCode } from "./types";

/**
 * 400~
 */

export const ParameterInvalid: ErrorCode = {
  name: "PARAMETER_INVALID",

  statusCode: HttpStatus.BAD_REQUEST,
};

export const ParameterOutOfRange: ErrorCode = {
  name: "PARAMETER_OUT_OF_RANGE",

  statusCode: HttpStatus.BAD_REQUEST,
};

export const AuthNotAuthenticated: ErrorCode = {
  name: "AUTH_NOT_AUTHENTICATED",

  statusCode: HttpStatus.UNAUTHORIZED,
};

export const AuthPermissionDenied: ErrorCode = {
  name: "AUTH_PERMISSION_DENIED",

  statusCode: HttpStatus.FORBIDDEN,
};

export const ResourceNotFound: ErrorCode = {
  name: "RESUOURCE_NOT_FOUND",

  statusCode: HttpStatus.NOT_FOUND,
};

export const Conflict: ErrorCode = {
  name: "CONFLICT",

  statusCode: HttpStatus.CONFLICT,
};

export const TooManyRequests: ErrorCode = {
  name: "TOO_MANY_REQUESTS",

  statusCode: HttpStatus.TOO_MANY_REQUESTS,
};

/**
 * 500~
 */

export const InternalServerError: ErrorCode = {
  name: "INTERNAL_SERVER_ERROR",

  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
};

export const RemoteServerError: ErrorCode = {
  name: "REMOTE_SERVER_ERROR",

  statusCode: HttpStatus.BAD_GATEWAY,
};
