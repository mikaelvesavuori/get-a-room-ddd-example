import { GeneratedVerificationCode } from "./GeneratedVerificationCode";
import { SlotId } from "./SlotId";

/**
 * @description Input data transfer object after parsing ingoing `event` object.
 */
export type InputDto = {
  /**
   * @description Slot ID that the verification relates to.
   */
  slotId: SlotId;
  /**
   * @description Code to verify.
   */
  verificationCode: GeneratedVerificationCode;
}