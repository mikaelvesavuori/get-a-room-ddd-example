import { Event } from './Event';
import { SlotDTO, SlotId } from './Slot';

/**
 * @description The Repository allows us to access a database of some kind.
 */
export interface Repository {
  /**
   * @description Get a slot from the source database.
   */
  loadSlot(slotId: SlotId): Promise<SlotDTO>;
  /**
   * @description Load all Slots for the day from the source database.
   */
  loadSlots(): Promise<SlotDTO[]>;
  /**
   * @description Add (create/update) a slot in the source database.
   */
  updateSlot(slot: SlotDTO): Promise<void>;
  /**
   * @description Add (append) an Event in the source database.
   */
  addEvent(event: Event): Promise<void>;
}
