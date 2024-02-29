import test from 'ava';

import { Record } from '../../src/domain/entities/Record';

/**
 * NEGATIVE TESTS
 */
test.serial('It should throw a RecordValidationError if missing required input data', async (t) => {
  const error = t.throws(() => new Record().fromDto({} as any));

  t.is(error?.name, 'RecordValidationError');
});
