import test from 'ava';

import { ReservationService } from '../../../src/domain/services/ReservationService';

/**
 * NEGATIVE TESTS
 */

test.serial('It should throw a MissingDependenciesError if missing dependencies', async (t) => {
  const error = await t.throwsAsync(async () => new ReservationService('' as any));

  t.is(error?.name, 'MissingDependenciesError');
});
