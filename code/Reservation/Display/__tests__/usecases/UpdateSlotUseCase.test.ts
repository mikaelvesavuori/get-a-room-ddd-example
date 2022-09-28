import test from 'ava';

import { UpdateSlotUseCase } from '../../src/application/usecases/UpdateSlotUseCase';

import { setupDependencies } from '../../src/infrastructure/utils/setupDependencies';

const dependencies = setupDependencies(true);

/**
 * POSITIVE TESTS
 */

test('It should update a slot', async (t) => {
  const slot = {
    event: 'SOMETHING',
    slotId: '1234asdf',
    slotStatus: 'CANCELLED',
    startsAt: '20220501',
    hostName: 'Somebody'
  };
  await UpdateSlotUseCase(dependencies, slot);

  t.pass();
});
