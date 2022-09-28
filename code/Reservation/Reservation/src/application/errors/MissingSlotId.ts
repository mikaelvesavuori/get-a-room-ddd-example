import { MikroLog } from 'mikrolog';

/**
 * @description Used when data input is missing a slot ID.
 */
export class MissingSlotId extends Error {
  constructor() {
    super();
    this.name = 'MissingSlotId';
    const message = `Missing slot ID!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
