import { AnalyticalRecord } from '../../interfaces/AnalyticalRecord';

import { RecordValidationError } from '../../errors/RecordValidationError';

/**
 * @description The `Record` entity that owns and operates on analytical records.
 *
 * @example You can reconstitute a Record from an AnalyticalRecord
 * loaded from a repository:
 * ```
 * const slot = new Record().fromDto(recordDto);
 * ```
 */
export class Record {
  private id: string;
  private correlationId: string;
  private event: string;
  private slotId: string;
  private startsAt: string;
  private hostName: string;

  constructor() {
    this.id = '';
    this.correlationId = '';
    this.event = '';
    this.slotId = '';
    this.startsAt = '';
    this.hostName = '';

    return this;
  }

  /**
   * @description Reconstitute a Record from a Data Transfer Object.
   */
  public fromDto(analyticalRecord: AnalyticalRecord): Record {
    if (
      !analyticalRecord.id ||
      !analyticalRecord.correlationId ||
      !analyticalRecord.event ||
      !analyticalRecord.slotId ||
      !analyticalRecord.startsAt ||
      !analyticalRecord.hostName
    )
      throw new RecordValidationError(JSON.stringify(analyticalRecord));

    this.id = analyticalRecord.id;
    this.correlationId = analyticalRecord.correlationId;
    this.event = analyticalRecord.event;
    this.slotId = analyticalRecord.slotId;
    this.startsAt = analyticalRecord.startsAt;
    this.hostName = analyticalRecord.hostName;

    return this;
  }

  /**
   * @description Return data as Data Transfer Object.
   */
  public toDto(): AnalyticalRecord {
    return {
      id: this.id,
      correlationId: this.correlationId,
      event: this.event,
      slotId: this.slotId,
      startsAt: this.startsAt,
      hostName: this.hostName
    };
  }
}
