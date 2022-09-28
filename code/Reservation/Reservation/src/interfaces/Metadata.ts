/**
 * @description User-provided metadata input.
 */
export type MetadataConfigInput = {
  /**
   * @description The version of the event.
   */
  version: number;
  /**
   * @description Which lifecycle stage the event pertains to.
   */
  lifecycleStage: LifecycleStage;
  /**
   * @description Domain of the producer.
   */
  domain: string;
  /**
   * @description System of the producer.
   */
  system: string;
  /**
   * @description Service of the producer.
   */
  service: string;
  /**
   * @description Team responsible for emitting this event.
   */
  team: string;
  /**
   * @description The host platform or infrastructure that runs the system.
   */
  hostPlatform: string;
  /**
   * @description The organization that owns this system.
   */
  owner: string;
  /**
   * @description The region of the responding function/system.
   */
  region: string;
  /**
   * @description What legal jurisdiction does this system fall into?
   * @example `EU`, `US`, `CN`
   */
  jurisdiction: string;
  /**
   * @description Tags for this event.
   */
  tags?: string[];
  /**
   * @description Data sensitivity classification for the contents of this event.
   */
  dataSensitivity?: DataSensitivity;
};

/**
 * @description Metadata that is extended with ID, correlation ID and a timestamp.
 */
export type Metadata = MetadataConfigInput & {
  /**
   * @description Event ID.
   */
  id: string;
  /**
   * @description Correlation ID for the function call.
   */
  correlationId: string;
  /**
   * @description Timestamp when the event was produced in ISO format.
   */
  timestamp: string;
  /**
   * @description Timestamp when the event was produced in Unix epoch format.
   */
  timestampEpoch: string;
};

/**
 * @description Valid lifecycles stages.
 */
type LifecycleStage = 'production' | 'qa' | 'test' | 'development' | 'staging' | 'demo';

/**
 * @description Valid data sensitivity levels.
 */
type DataSensitivity = 'public' | 'sensitive' | 'proprietary' | 'secret';
