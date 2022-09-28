import test from 'ava';

import { GenerateCodeUseCase } from '../../src/application/usecases/GenerateCodeUseCase';

import { setupDependencies } from '../../src/infrastructure/utils/setupDependencies';

const dependencies = setupDependencies(true);
const { repository } = dependencies;

/**
 * POSITIVE TESTS
 */

test('It should generate an 8 character code', async (t) => {
  const code = await GenerateCodeUseCase(repository, { slotId: 'asdf1234' });

  t.is(code.length, 8);
});
