import { AnalyticalRecord } from '../../interfaces/AnalyticalRecord';
import { Repository } from '../../interfaces/Repository';

/**
 * @description Factory function for local repository.
 */
export function createLocalRepository(): LocalRepository {
  return new LocalRepository();
}

/**
 * @description The local repo acts as a simple mock for testing and similar purposes.
 */
class LocalRepository implements Repository {
  dataStore: AnalyticalRecord[];

  constructor() {
    this.dataStore = [];
  }

  /**
   * @description Add (create/update) a Record to the Analytics database.
   */
  async add(record: AnalyticalRecord): Promise<void> {
    console.log('Updating record:', record);
    this.dataStore.push(record);
  }
}
