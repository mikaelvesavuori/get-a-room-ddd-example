import test from 'ava';

import { RemoveCodeUseCase } from '../../src/application/usecases/RemoveCodeUseCase';

import { setupDependencies } from '../../src/infrastructure/utils/setupDependencies';

const dependencies = setupDependencies(true);
const { repository } = dependencies;

/**
 * POSITIVE TESTS
 */

test('It should remove a code', async (t) => {
  await RemoveCodeUseCase(repository, { slotId: 'asdf1234' });

  t.pass();
});
