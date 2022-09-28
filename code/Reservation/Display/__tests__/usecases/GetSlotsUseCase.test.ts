import test from 'ava';

import { GetSlotsUseCase } from '../../src/application/usecases/GetSlotsUseCase';

import { setupDependencies } from '../../src/infrastructure/utils/setupDependencies';

const dependencies = setupDependencies(true);

/**
 * POSITIVE TESTS
 */

test('It should get slots', async (t) => {
  const slots = await GetSlotsUseCase(dependencies);
  t.deepEqual(slots, [{ something: 'abc' }, { something: 'xyz' }]);
});
