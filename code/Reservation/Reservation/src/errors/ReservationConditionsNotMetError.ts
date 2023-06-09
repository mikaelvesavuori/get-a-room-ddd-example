import { MikroLog } from 'mikrolog';

/**
 * @description Used when reservation conditions are not met.
 */
export class ReservationConditionsNotMetError extends Error {
  constructor(status: string) {
    super(status);
    this.name = 'ReservationConditionsNotMetError';
    const message = `Slot is not in the correct status to be updated to 'RESERVED' status, it was in '${status}' state!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
