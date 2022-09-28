import test from 'ava';

import metadataConfig from '../../../testdata/metadataConfig.json';
import { correctSlots } from '../../../testdata/TestDatabase';

import { setupDependencies } from '../../../src/infrastructure/utils/setupDependencies';

/**
 * POSITIVE TESTS
 */

test.serial('It should setup local (mock) dependencies', (t) => {
  const dependencies = setupDependencies(metadataConfig as any, true);
  const publisherIsObject = dependencies.domainEventPublisher instanceof Object;
  const repositoryIsObject = dependencies.repository instanceof Object;
  const dependenciesExist = publisherIsObject && repositoryIsObject;

  t.is(dependenciesExist, true);
});

test.serial('It should setup local (mock) dependencies with provided test data', (t) => {
  const dependencies = setupDependencies(metadataConfig as any, true, correctSlots);
  const publisherIsObject = dependencies.domainEventPublisher instanceof Object;
  const repositoryIsObject = dependencies.repository instanceof Object;
  const dependenciesExist = publisherIsObject && repositoryIsObject;

  t.is(dependenciesExist, true);
});

test.serial('It should setup dependencies', (t) => {
  process.env.REGION = 'something';
  process.env.TABLE_NAME = 'something';

  const dependencies = setupDependencies(metadataConfig as any, false);
  const publisherIsObject = dependencies.domainEventPublisher instanceof Object;
  const repositoryIsObject = dependencies.repository instanceof Object;
  const dependenciesExist = publisherIsObject && repositoryIsObject;

  t.is(dependenciesExist, true);

  process.env.REGION = '';
  process.env.TABLE_NAME = '';
});
