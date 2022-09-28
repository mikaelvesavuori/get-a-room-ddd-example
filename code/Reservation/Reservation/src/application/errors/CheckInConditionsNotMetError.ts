import { MikroLog } from 'mikrolog';

/**
 * @description Used when check in conditions are not met.
 */
export class CheckInConditionsNotMetError extends Error {
  constructor(status: string) {
    super(status);
    this.name = 'CheckInConditionsNotMetError';
    const message = `Slot is not in the correct status to be updated to 'CHECKED_IN' status, it was in '${status}' state!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
