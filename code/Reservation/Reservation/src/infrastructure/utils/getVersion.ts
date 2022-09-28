import { MikroLog } from 'mikrolog';

/**
 * @description Get version of event or request.
 */
export function getVersion(event: Record<string, any>): number {
  const body: Record<string, string | number> =
    event?.body && typeof event?.body === 'string' ? JSON.parse(event.body) : event.body;
  const explicitVersion = event?.detail?.metadata?.version || body?.version || 0;

  if (!explicitVersion) {
    const logger = MikroLog.start();
    logger.warn(
      `No explicit version was used when calling the service: Will default to '1'. Errors may happen as a consequence...`
    );
    return 1;
  }

  return explicitVersion;
}
