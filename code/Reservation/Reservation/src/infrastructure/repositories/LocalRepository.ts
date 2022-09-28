import { Repository } from '../../interfaces/Repository';
import { SlotDTO, SlotId } from '../../interfaces/Slot';

import { slots } from '../../../testdata/TestDatabase';
import { Event } from '../../interfaces/Event';
import { TestData } from '../../interfaces/Data';

/**
 * @description Factory function for local repository.
 */
export function createLocalRepository(testData?: TestData): LocalRepository {
  return new LocalRepository(testData);
}

/**
 * @description The local repo acts as a simple mock for testing and similar purposes.
 * The `LocalRepository` can optionally be initialized with custom test data, else will default
 * to a set of functional test data.
 */
class LocalRepository implements Repository {
  slots: SlotDTO[];
  events: Event[] = [];

  constructor(testData?: TestData) {
    this.slots = testData ? testData : slots;
  }

  /**
   * @description Load a Slot from the source database.
   */
  async loadSlot(slotId: SlotId): Promise<SlotDTO> {
    const slot: SlotDTO[] = this.slots.filter((slot: SlotDTO) => slot.slotId === slotId);
    console.log('Loaded slot:', slot);
    return slot[0];
  }

  /**
   * @description Load all Slots for the day from the source database.
   */
  public async loadSlots(): Promise<SlotDTO[]> {
    return this.slots;
  }

  /**
   * @description Add (create/update) a Slot to the source database.
   */
  public async updateSlot(slot: SlotDTO): Promise<void> {
    const { slotId } = slot;
    const slots: SlotDTO[] = this.slots.filter((slot: SlotDTO) => slot.slotId !== slotId);
    slots.push(slot);
    this.slots = slots;
  }

  /**
   * @description Add (append) an Event in the source database.
   */
  public async addEvent(event: Event): Promise<void> {
    this.events.push(event);
  }
}
