import test from 'ava';

import { sanitizeInputData } from '../../../src/application/services/sanitizeInputData';

import { SlotDTO } from '../../../src/interfaces/Slot';

/**
 * NEGATIVE TESTS
 */

test('It should throw a MissingInputDataFieldError if missing time', (t) => {
  const dto = {
    slotId: 'string',
    hostName: 'string',
    slotStatus: 'OPEN',
    createdAt: 'string',
    updatedAt: 'string'
  } as SlotDTO;

  const error = t.throws(() => sanitizeInputData(dto));

  t.is(error?.name, 'MissingInputDataFieldError');
});

test('It should throw a MissingInputDataTimeError if missing start time', (t) => {
  const dto = {
    slotId: 'string',
    hostName: 'string',
    timeSlot: {
      startTime: '',
      endTime: 'asdf'
    },
    slotStatus: 'OPEN',
    createdAt: 'string',
    updatedAt: 'string'
  } as SlotDTO;

  const error = t.throws(() => sanitizeInputData(dto));

  t.is(error?.name, 'MissingInputDataTimeError');
});

test('It should throw a MissingInputDataTimeError if missing end time', (t) => {
  const dto = {
    slotId: 'string',
    hostName: 'string',
    timeSlot: {
      startTime: 'asdf',
      endTime: ''
    },
    slotStatus: 'OPEN',
    createdAt: 'string',
    updatedAt: 'string'
  } as SlotDTO;

  const error = t.throws(() => sanitizeInputData(dto));

  t.is(error?.name, 'MissingInputDataTimeError');
});
