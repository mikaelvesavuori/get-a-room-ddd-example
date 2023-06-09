import { MikroLog } from 'mikrolog';

/**
 * @description Used when `Slot` is missing input dependencies.
 */
export class MissingDependenciesError extends Error {
  constructor() {
    super();
    this.name = 'MissingDependenciesError';
    const message = `Missing dependencies!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
