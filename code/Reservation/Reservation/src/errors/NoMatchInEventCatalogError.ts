import { MikroLog } from 'mikrolog';

/**
 * @description Used when a matching event was not found in the event catalog.
 */
export class NoMatchInEventCatalogError extends Error {
  constructor(eventName: string) {
    super(eventName);
    this.name = 'NoMatchInEventCatalogError';
    const message = `A matching event was not found in the event catalog! The event that was passed in was '${eventName}'.`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
