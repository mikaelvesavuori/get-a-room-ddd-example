import test from 'ava';

import { createDynamoDbRepository } from '../../src/infrastructure/repositories/DynamoDbRepository';

/**
 * POSITIVE TESTS
 */

test.serial('It should make a new repository instance', async (t) => {
  process.env.REGION = 'eu-north-1';
  process.env.TABLE_NAME = 'something';

  createDynamoDbRepository();

  t.pass();

  process.env.REGION = '';
  process.env.TABLE_NAME = '';
});

test.serial('It should add a new record', async (t) => {
  process.env.REGION = 'eu-north-1';
  process.env.TABLE_NAME = 'something';

  const db = createDynamoDbRepository();
  await db.addCode('verificationCode', 'slotId');

  t.pass();

  process.env.REGION = '';
  process.env.TABLE_NAME = '';
});

test.serial('It should get a verification code', async (t) => {
  process.env.REGION = 'eu-north-1';
  process.env.TABLE_NAME = 'something';

  const db = createDynamoDbRepository();
  await db.getCode('some-slot-id');

  t.pass();

  process.env.REGION = '';
  process.env.TABLE_NAME = '';
});

test.serial('It should remove a verification code', async (t) => {
  process.env.REGION = 'eu-north-1';
  process.env.TABLE_NAME = 'something';

  const db = createDynamoDbRepository();
  await db.removeCode('some-slot-id');

  t.pass();

  process.env.REGION = '';
  process.env.TABLE_NAME = '';
});

/**
 * NEGATIVE TESTS
 */

test.serial(
  'It should fail to create a new repository if missing required environment variables',
  async (t) => {
    process.env.REGION = '';
    process.env.TABLE_NAME = '';

    const error = await t.throwsAsync(async () => {
      const db = createDynamoDbRepository();
      await db.addCode('verificationCode', 'slotId');
    });

    t.is(error?.name, 'MissingEnvVarsError');
  }
);
