import test from 'ava';

import { AddRecordUseCase } from '../../src/application/usecases/AddRecordUseCase';

import { setupDependencies } from '../../src/infrastructure/utils/setupDependencies';

const dependencies = setupDependencies(true);

/**
 * POSITIVE TESTS
 */

test('It should add a record', async (t) => {
  const { repository } = dependencies;
  const data = {
    id: 'abc1234',
    correlationId: 'qwerty3901',
    event: 'CHECKED_IN',
    slotId: 'ldkj2h921',
    startsAt: '20220501',
    hostName: 'Somebody'
  };

  await AddRecordUseCase(dependencies, data);

  // @ts-ignore
  const result = repository.dataStore[0]; // Ugly hack to "get" items from local repository

  t.deepEqual(result, data);
});
