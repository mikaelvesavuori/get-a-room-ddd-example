import { MikroLog } from 'mikrolog';

/**
 * @description Used when verification code is invalid.
 */
export class InvalidVerificationCodeError extends Error {
  constructor() {
    super();
    this.name = 'InvalidVerificationCodeError';
    const message = `Verification code is not valid!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
