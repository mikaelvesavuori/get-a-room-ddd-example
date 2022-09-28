import test from 'ava';

import { getCleanedItems } from '../../../src/infrastructure/utils/getCleanedItems';

/**
 * POSITIVE TESTS
 */

test.serial('It should get a set of cleaned DynamoDB items', (t) => {
  const expected = [
    {
      createdAt: '2022-07-29T05:00:08.328Z',
      hostName: '',
      slotId: '53ebfc40-a0c0-4240-9949-6f66d699202b',
      slotStatus: 'OPEN',
      timeSlot: {
        endTime: '2022-07-29T12:00:00.000Z',
        startTime: '2022-07-29T11:00:00.000Z'
      },
      updatedAt: '2022-07-29T05:00:08.328Z'
    }
  ];

  const input = [
    {
      hostName: { S: '' },
      id: { S: '53ebfc40-a0c0-4240-9949-6f66d699202b' },
      updatedAt: { S: '2022-07-29T05:00:08.328Z' },
      slotStatus: { S: 'OPEN' },
      createdAt: { S: '2022-07-29T05:00:08.328Z' },
      timeSlot: {
        S: '{"startTime":"2022-07-29T11:00:00.000Z","endTime":"2022-07-29T12:00:00.000Z"}'
      }
    }
  ];

  const response = getCleanedItems(input);

  t.deepEqual(response, expected);
});

test.serial('It should return an empty array if items are not of expected shape', (t) => {
  const expected: any = [];

  const input: any = {
    something: {
      a: 123
    }
  };
  const response = getCleanedItems(input);

  t.deepEqual(response, expected);
});
