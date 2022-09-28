import { Slot } from '../../interfaces/Slot';
import { Repository } from '../../interfaces/Repository';

/**
 * @description Factory function for local repository.
 */
export function createLocalRepository(): LocalRepository {
  return new LocalRepository();
}

/**
 * @description The local repo acts as a simple mock
 * for testing and similar purposes.
 */
class LocalRepository implements Repository {
  dataStore: Slot[];

  constructor() {
    this.dataStore = [];
  }

  /**
   * @description Add (create/update) a Record to the Analytics database.
   */
  async add(slot: Slot): Promise<void> {
    console.log('Updating slot:', slot);
    this.dataStore.push(slot);
  }

  /**
   * @description Load all Slots for the day from the source database.
   */
  async getSlots(): Promise<any> {
    return [{ something: 'abc' }, { something: 'xyz' }];
  }
}
