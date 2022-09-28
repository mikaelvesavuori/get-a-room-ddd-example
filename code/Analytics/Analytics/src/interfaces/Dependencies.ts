import { Repository } from './Repository';

/**
 * @description Represents the basic dependencies that usually
 * needs to be injected into our use cases.
 */
export type Dependencies = {
  /**
   * @description Repository implementation.
   */
  repository: Repository;
};
