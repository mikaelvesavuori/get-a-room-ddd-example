import { MikroLog } from "mikrolog";

/**
 * @description Used when data input is missing one or
 * more required fields.
 */
export class MissingRequiredFieldsError extends Error {
  constructor() {
    super();
    this.name = 'MissingRequiredFieldsError';
    const message = `Missing one or more required fields!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
