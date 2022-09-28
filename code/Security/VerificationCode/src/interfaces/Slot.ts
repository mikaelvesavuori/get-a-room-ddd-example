import { GeneratedVerificationCode } from "./GeneratedVerificationCode";
import { SlotId } from "./SlotId";

/**
 * @description Time slot and its verification code.
 */
export type Slot = {
  slotId: SlotId;
  code: GeneratedVerificationCode;
};
