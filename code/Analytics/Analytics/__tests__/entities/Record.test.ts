import test from 'ava';

import { Record } from '../../src/domain/entities/Record';

/**
 * NEGATIVE TESTS
 */
test.serial(
  'It should throw a MissingDependenciesError if no dependencies are passed in',
  async (t) => {
    const error = t.throws(() => new Record({} as any));

    t.is(error?.name, 'MissingDependenciesError');
  }
);
