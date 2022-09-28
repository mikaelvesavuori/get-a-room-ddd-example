import test from 'ava';

import { createDynamoDbRepository } from '../../src/infrastructure/repositories/DynamoDbRepository';

/**
 * POSITIVE TESTS
 */

test('It should make a new repository instance', async (t) => {
  process.env.REGION = 'eu-north-1';
  process.env.TABLE_NAME = 'something';

  createDynamoDbRepository();

  t.pass();
});

test('It should add a new record', async (t) => {
  process.env.REGION = 'eu-north-1';
  process.env.TABLE_NAME = 'something';

  const db = createDynamoDbRepository();
  const input: any = {
    id: 'string',
    correlationId: 'string',
    event: 'string',
    slotId: 'string',
    startsAt: 'string',
    hostName: 'string'
  };
  await db.add(input);

  t.pass();
});

/**
 * NEGATIVE TESTS
 */

test('It should fail to create a new repository if missing required environment variables', async (t) => {
  process.env.REGION = '';
  process.env.TABLE_NAME = '';

  const error = await t.throwsAsync(async () => {
    const db = createDynamoDbRepository();
    const input: any = {
      id: 'string',
      correlationId: 'string',
      event: 'string',
      slotId: 'string',
      startsAt: 'string',
      hostName: 'string'
    };
    await db.add(input);
  });

  t.is(error?.name, 'MissingEnvVarsError');
});

test('It should throw a FailureToAddError if missing required input or if getting an error', async (t) => {
  process.env.REGION = 'eu-north-1';
  process.env.TABLE_NAME = 'something';

  const error = await t.throwsAsync(async () => {
    const db = createDynamoDbRepository();
    const input: any = {};
    await db.add(input);
  });

  t.is(error?.name, 'FailureToAddError');
});
