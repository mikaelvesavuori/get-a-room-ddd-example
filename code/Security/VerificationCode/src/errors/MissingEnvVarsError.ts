import { MikroLog } from "mikrolog";

/**
 * @description Used when required environments are missing.
 *
 * @example ```
 *  throw new MissingEnvVarsError(
 *    JSON.stringify([
 *     { key: 'REGION', value: process.env.REGION },
 *     { key: 'TABLE_NAME', value: process.env.TABLE_NAME }
 *   ])
 *  );
  ```
 */
export class MissingEnvVarsError extends Error {
  constructor(variables: string) {
    super(variables);
    this.name = 'MissingEnvVarsError';
    const message = `Missing one or more required environment variables! ${variables}`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
