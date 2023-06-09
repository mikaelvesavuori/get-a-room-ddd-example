import { MikroLog } from 'mikrolog';

/**
 * @description Used when input data is missing a required field.
 */
export class MissingInputDataFieldError extends Error {
  constructor() {
    super();
    this.name = 'MissingInputDataFieldError';
    const message = `Missing required input field!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
