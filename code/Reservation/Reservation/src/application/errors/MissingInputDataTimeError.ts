import { MikroLog } from 'mikrolog';

/**
 * @description Used when input data is missing a `timeSlot.startTime` and/or `timeSlot.endTime` field(s).
 */
export class MissingInputDataTimeError extends Error {
  constructor() {
    super();
    this.name = 'MissingInputDataTimeError';
    const message = `Missing 'startTime' and/or 'endTime' field!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
