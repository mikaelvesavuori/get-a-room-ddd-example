import { MikroLog } from 'mikrolog';

/**
 * @description Used when `EventBridgeCatalog` is missing required metadata fields in configuration object.
 */
export class MissingMetadataFieldsError extends Error {
  constructor(metadataConfig: any) {
    super(metadataConfig);
    this.name = 'MissingMetadataFieldsError';
    const message = `Missing required fields to produce metadata! Input was: ${JSON.stringify(
      metadataConfig
    )}`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
