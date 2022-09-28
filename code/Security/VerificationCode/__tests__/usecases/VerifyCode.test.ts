import test from 'ava';

import { VerifyCodeUseCase } from '../../src/application/usecases/VerifyCodeUseCase';

import { setupDependencies } from '../../src/infrastructure/utils/setupDependencies';

const dependencies = setupDependencies(true);
const { repository } = dependencies;

/**
 * POSITIVE TESTS
 */

test('It should successfully verify an existing code', async (t) => {
  const result = await VerifyCodeUseCase(repository, {
    slotId: 'asdf1234',
    verificationCode: 'abc123xy'
  });

  t.is(result, true);
});

/**
 * NEGATIVE TESTS
 */

test('It should not verify a non-matching code', async (t) => {
  const result = await VerifyCodeUseCase(repository, { slotId: 'abc', verificationCode: 'qwerty' });

  t.is(result, false);
});
