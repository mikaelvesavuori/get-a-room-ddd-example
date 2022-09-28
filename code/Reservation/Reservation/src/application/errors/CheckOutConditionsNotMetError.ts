import { MikroLog } from 'mikrolog';

/**
 * @description Used when check out conditions are not met.
 */
export class CheckOutConditionsNotMetError extends Error {
  constructor(status: string) {
    super(status);
    this.name = 'CheckOutConditionsNotMetError';
    const message = `Slot is not in the correct status to be updated to 'CHECKED_OUT' status, it was in '${status}' state!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
