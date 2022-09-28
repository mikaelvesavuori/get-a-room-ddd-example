import { GeneratedVerificationCode } from "./GeneratedVerificationCode";
import { SlotId } from "./SlotId";

/**
 * @description Input when calling the `VerifyCode` use case.
 */
export type VerifyCodeInput = {
  /**
   * @description Slot ID that the verification relates to.
   */
  slotId: SlotId;
  /**
   * @description Code to verify.
   */
  verificationCode: GeneratedVerificationCode;
}
