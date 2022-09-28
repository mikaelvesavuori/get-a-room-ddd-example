import test from 'ava';

import { setupDependencies } from '../../src/infrastructure/utils/setupDependencies';

/**
 * POSITIVE TESTS
 */

test('It should be able to setup mock dependencies', (t) => {
  const dependencies = setupDependencies(true);
  const repositoryIsObject = dependencies.repository instanceof Object;

  t.is(repositoryIsObject, true);
});

test('It should be able to setup dependencies', (t) => {
  process.env.REGION = 'something';
  process.env.TABLE_NAME = 'something';

  const dependencies = setupDependencies(false);
  const repositoryIsObject = dependencies.repository instanceof Object;

  t.is(repositoryIsObject, true);

  process.env.REGION = '';
  process.env.TABLE_NAME = '';
});
