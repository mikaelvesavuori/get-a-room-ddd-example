import { MikroLog } from 'mikrolog';

/**
 * @description Used when data input is missing request body.
 */
export class MissingRequestBodyError extends Error {
  constructor() {
    super();
    this.name = 'MissingRequestBodyError';
    const message = `Missing request body!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
