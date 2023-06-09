import { MikroLog } from "mikrolog";

/**
 * @description Used when a problem occurred while attempting to
 * construct a cleaned object representation of data coming from
 * DynamoDB.
 */
export class FailedToConstructCleanedItemError extends Error {
  constructor() {
    super();
    this.name = 'FailedToConstructCleanedItemError';
    const message = `Unable to get item!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
