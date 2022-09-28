import { MikroLog } from 'mikrolog';

/**
 * @description Used when `Record` has validation errors during the `fromDto()` call.
 */
export class RecordValidationError extends Error {
  constructor(record: string) {
    super(record);
    this.name = 'RecordValidationError';
    const message = `Record reconstitution failed with record: ${record}!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
