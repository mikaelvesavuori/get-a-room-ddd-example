import test from 'ava';

import { createDynamoDbRepository } from '../../src/infrastructure/repositories/DynamoDbRepository';

import testTimes from '../../testdata/testTimesOutput.json';

/**
 * POSITIVE TESTS
 */

test.serial('It should make a new repository instance', async (t) => {
  process.env.REGION = 'eu-north-1';
  process.env.TABLE_NAME = 'something';

  createDynamoDbRepository();

  t.pass();
});

test.serial('It should add a new record', async (t) => {
  process.env.REGION = 'eu-north-1';
  process.env.TABLE_NAME = 'something';

  const data = {
    event: 'string',
    slotId: 'string',
    slotStatus: 'string',
    startsAt: 'string',
    hostName: 'string'
  };

  const db = createDynamoDbRepository();
  await db.add(data);

  t.pass();
});

test.serial('It should be able to get times', async (t) => {
  process.env.REGION = 'eu-north-1';
  process.env.TABLE_NAME = 'something';

  const expected = testTimes;

  const db = createDynamoDbRepository();
  const response = await db.getSlots();

  t.deepEqual(response, expected);
});

/**
 * NEGATIVE TESTS
 */

test.serial(
  'It should fail to create a new repository if missing required environment variables',
  async (t) => {
    process.env.REGION = '';
    process.env.TABLE_NAME = '';

    const data = {
      event: 'string',
      slotId: 'string',
      slotStatus: 'string',
      startsAt: 'string',
      hostName: 'string'
    };

    const error = await t.throwsAsync(async () => {
      const db = createDynamoDbRepository();
      await db.add(data);
    });

    t.is(error?.name, 'MissingEnvVarsError');
  }
);
