import { GeneratedVerificationCode } from '../../interfaces/GeneratedVerificationCode';
import { Repository } from '../../interfaces/Repository';
import { Slot } from '../../interfaces/Slot';
import { SlotId } from '../../interfaces/SlotId';

/**
 * @description Factory function for local repository.
 */
export function createNewLocalRepository(): LocalRepo {
  return new LocalRepo();
}

/**
 * @description The local repo acts as a simple mock for testing and similar purposes.
 * The LocalRepo can optionally be initialized with custom test data, else will default
 * to a set of functional test data.
 */
class LocalRepo implements Repository {
  slots: Slot[];

  constructor() {
    this.slots = [
      {
        slotId: 'asdf1234',
        code: 'abc123xy'
      }
    ];
  }

  /**
   * @description Get verification code from source system.
   */
  async getCode(slotId: SlotId): Promise<GeneratedVerificationCode> {
    const slot = this.slots.filter((slot: Slot) => slot.slotId === slotId)[0];
    if (slot?.['code']) return slot['code'];
    return '' as unknown as GeneratedVerificationCode;
  }

  /**
   * @description Add (create/update) a verification code to the source database.
   */
  async addCode(verificationCode: GeneratedVerificationCode, slotId: SlotId): Promise<void> {
    this.slots.push({ slotId, code: verificationCode });
  }

  /**
   * @description Remove a verification code from the source database.
   */
  async removeCode(slotId: SlotId): Promise<void> {
    console.log(slotId);
  }
}
