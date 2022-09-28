import test from 'ava';

import { TimeSlot } from '../../../src/domain/valueObjects/TimeSlot';

/**
 * NEGATIVE TESTS
 */

test.serial('It should throw an InvalidHourCountError', (t) => {
  const error = t.throws(() => {
    const timeSlot = new TimeSlot();
    timeSlot.startingAt(25);
  });

  t.is(error?.name, 'InvalidHourCountError');
});
