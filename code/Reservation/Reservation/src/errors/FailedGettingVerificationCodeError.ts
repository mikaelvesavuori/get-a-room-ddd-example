import { MikroLog } from 'mikrolog';

/**
 * @description Used when a failure occurred when attempting to
 * get a verification code.
 */
export class FailedGettingVerificationCodeError extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = 'FailedGettingVerificationCodeError';
    const message = `Failed getting verification code! Message: ${errorMessage}`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
