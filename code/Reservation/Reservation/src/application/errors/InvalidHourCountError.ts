import { MikroLog } from 'mikrolog';

/**
 * @description Used when `TimeSlot` gets an unreasonably high hour to work on.
 */
export class InvalidHourCountError extends Error {
  constructor() {
    super();
    this.name = 'InvalidHourCountError';
    const message = `TimeSlot got an invalid (too high) hour!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
