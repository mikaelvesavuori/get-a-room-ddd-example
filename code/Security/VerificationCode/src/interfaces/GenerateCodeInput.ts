import { SlotId } from './SlotId';

/**
 * @description Input when calling the `GenerateCode` use case.
 */
export type GenerateCodeInput = {
  /**
   * @description ID of slot to generate code for.
   */
  slotId: SlotId;
};
