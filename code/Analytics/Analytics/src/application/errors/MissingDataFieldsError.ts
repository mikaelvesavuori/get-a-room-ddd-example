import { MikroLog } from 'mikrolog';

/**
 * @description Used when data input is missing required fields.
 */
export class MissingDataFieldsError extends Error {
  constructor() {
    super();
    this.name = 'MissingDataFieldsError';
    const message = `Missing one or more required fields!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
