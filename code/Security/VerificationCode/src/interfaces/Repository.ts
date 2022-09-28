import { GeneratedVerificationCode } from "./GeneratedVerificationCode";
import { SlotId } from "./SlotId";

/**
 * @description The Repository allows us to access a database of some kind.
 */
export interface Repository {
  /**
   * @description Get verification code from source system.
   */
  getCode(slotId: SlotId): Promise<GeneratedVerificationCode>;
  /**
   * @description Add (create/update) a verification code to the source database.
   */
  addCode(verificationCode: GeneratedVerificationCode, slotId: SlotId): Promise<void>;
  /**
   * @description Remove a verification code from the source database.
   */
  removeCode(slotId: SlotId): Promise<void>;
}
