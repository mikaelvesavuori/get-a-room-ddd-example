import { MikroLog } from "mikrolog";

/**
 * @description Used when data input (event or request) is using
 * an unsupported version.
 */
export class UnsupportedVersionError extends Error {
  constructor() {
    super();
    this.name = 'UnsupportedVersionError';
    const message = `The version of the event or request is not supported!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
