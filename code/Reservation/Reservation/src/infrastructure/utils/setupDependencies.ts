import { Dependencies } from '../../interfaces/Dependencies';
import { MetadataConfigInput } from '../../interfaces/Metadata';
import { TestData } from '../../interfaces/Data';

import { createDomainEventPublisherService } from '../../application/services/DomainEventPublisherService';

import { createDynamoDbRepository } from '../repositories/DynamoDbRepository';
import { createLocalRepository } from '../repositories/LocalRepository';

import { createEventBridgeEmitter } from '../emitters/EventBridgeEmitter';
import { createLocalEmitter } from '../emitters/LocalEmitter';

import { setEnv } from '../../../testUtils';

/**
 * @description Utility that returns a complete dependencies object
 * based on implementations either "real" infrastructure or mocked ones.
 */
export function setupDependencies(
  metadataConfig: MetadataConfigInput,
  localUse?: boolean,
  testData?: TestData
): Dependencies {
  if (localUse) setEnv();

  const region = process.env.REGION || '';

  const repository = localUse ? createLocalRepository(testData) : createDynamoDbRepository();
  const eventEmitter = localUse ? createLocalEmitter() : createEventBridgeEmitter(region);
  const domainEventPublisher = createDomainEventPublisherService({ eventEmitter });

  return {
    domainEventPublisher,
    repository,
    metadataConfig
  };
}
