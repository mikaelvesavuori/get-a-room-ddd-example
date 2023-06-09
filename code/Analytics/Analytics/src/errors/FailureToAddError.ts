import { MikroLog } from 'mikrolog';

/**
 * @description Used when an error occurs while attempting to add a record.
 */
export class FailureToAddError extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = 'FailureToAddError';
    const message = `Error while attempting to add a record: ${errorMessage}`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
