/**
 * @description Analytical record.
 */
export interface AnalyticalRecord {
  /**
   * @description The ID of the event. Unique to the analytics context and not referable from other databases.
   */
  id: string;
  /**
   * @description The correlation ID for the function call that generated this event. Referable from other databases.
   */
  correlationId: string;
  /**
   * @description The type of user interaction event that has occurred.
   */
  event: string;
  /**
   * @description The slot ID relating to this event.
   */
  slotId: string;
  /**
   * @description Start time of the slot in ISO format.
   */
  startsAt: string;
  /**
   * @description The name of the host.
   */
  hostName: string;
}
