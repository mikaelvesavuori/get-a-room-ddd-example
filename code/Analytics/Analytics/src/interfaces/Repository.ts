import { AnalyticalRecord } from './AnalyticalRecord';

/**
 * @description The Repository allows us to access a database of some kind.
 */
export interface Repository {
  /**
   * @description Add (create/update) a Record to the Analytics database.
   */
  add(record: AnalyticalRecord): Promise<void>;
}
