import { Slot } from './Slot';

/**
 * @description The Repository allows us to access a database of some kind.
 */
export interface Repository {
  /**
   * @description Add (create/update) a time slot to the database.
   */
  add(slot: Slot): Promise<void>;
  /**
   * @description Get time slots for today.
   */
  getSlots(): Promise<Slot[]>;
}
