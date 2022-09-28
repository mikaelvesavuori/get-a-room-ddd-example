import { MikroLog } from 'mikrolog';

/**
 * @description Used when `Record` is missing input dependencies.
 */
export class MissingDependenciesError extends Error {
  constructor() {
    super();
    this.name = 'MissingDependenciesError';
    const message = `Missing dependencies when constructing Record!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
