import { MikroLog } from 'mikrolog';

/**
 * @description Used when a matching event was not found in the event catalog.
 */
export class MissingSlotError extends Error {
  constructor() {
    super();
    this.name = 'MissingSlotError';
    const message = `A slot was not found with the provided ID.`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
