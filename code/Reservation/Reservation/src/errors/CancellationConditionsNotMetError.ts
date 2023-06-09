import { MikroLog } from 'mikrolog';

/**
 * @description Used when cancellation conditions are not met.
 */
export class CancellationConditionsNotMetError extends Error {
  constructor(status: string) {
    super(status);
    this.name = 'CancellationConditionsNotMetError';
    const message = `Slot is not in the correct status to be updated to 'CANCELLED' status, it was in '${status}' state!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
