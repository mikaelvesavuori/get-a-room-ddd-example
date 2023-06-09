import { MikroLog } from 'mikrolog';

/**
 * @description Used when the `Authorization` header is missing
 * one or more required pieces of data.
 */
export class AuthorizationHeaderError extends Error {
  constructor() {
    super();
    this.name = 'AuthorizationHeaderError';
    const message = `Missing verification code and/or slot ID in 'Authorization' header!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
