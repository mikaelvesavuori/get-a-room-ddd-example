import { MikroLog } from 'mikrolog';

/**
 * @description Used when a URL to the Security API endpoint
 * is missing.
 */
export class MissingSecurityApiEndpoint extends Error {
  constructor() {
    super();
    this.name = 'MissingSecurityApiEndpoint';
    const message = `Missing security API endpoint!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
