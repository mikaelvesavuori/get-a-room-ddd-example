import { Repository } from './Repository';
import { DomainEventPublisherService } from './DomainEventPublisherService';
import { MetadataConfigInput } from './Metadata';

/**
 * @description Represents the basic dependencies that usually
 * needs to be injected into our use cases.
 */
export type Dependencies = {
  /**
   * @description Repository implementation.
   */
  repository: Repository;
  /**
   * @description Instance of the DomainEventPublisherService.
   */
  domainEventPublisher: DomainEventPublisherService;
  /**
   * @description Metadata configuration object.
   */
  metadataConfig: MetadataConfigInput;
};
