import test from 'ava';

import { SlotDTO } from '../../../src/interfaces/Slot';

import { CreatedEvent } from '../../../src/domain/events/Event';
import { createDynamoDbRepository } from '../../../src/infrastructure/repositories/DynamoDbRepository';

import testDataOutput from '../../../testdata/testDataOutput.json';
import { cleanEnv, setEnv } from '../../../testUtils';

test.beforeEach(() => setEnv());
test.afterEach(() => cleanEnv());

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

  const data: SlotDTO = {
    slotId: 'string',
    hostName: 'string',
    timeSlot: {
      startTime: 'a',
      endTime: 'b'
    },
    slotStatus: 'OPEN',
    createdAt: 'string',
    updatedAt: 'string'
  };

  const db = createDynamoDbRepository();
  await db.updateSlot(data);

  t.pass();
});

test.serial('It should load a single slot', async (t) => {
  process.env.REGION = 'eu-north-1';
  process.env.TABLE_NAME = 'something';

  const expected = testDataOutput[0];

  const db = createDynamoDbRepository();
  const slot = await db.loadSlot('something');

  t.deepEqual(slot, expected);
});

test.serial('It should load multiple slots', async (t) => {
  process.env.REGION = 'eu-north-1';
  process.env.TABLE_NAME = 'something';

  const expected = testDataOutput;

  const db = createDynamoDbRepository();
  const slots = await db.loadSlots();

  t.deepEqual(slots, expected);
});

test.serial('It should add an event', async (t) => {
  process.env.REGION = 'eu-north-1';
  process.env.TABLE_NAME = 'something';

  const db = createDynamoDbRepository();
  await db.addEvent(
    new CreatedEvent({
      event: {
        eventName: 'CREATED',
        slotId: 'some-id',
        slotStatus: 'OPEN',
        hostName: 'Sam Person',
        startTime: '2050-01-01-1000'
      },
      metadataConfig: {
        version: 1,
        lifecycleStage: 'demo',
        domain: 'some-domain',
        system: 'some-system',
        service: 'some-service',
        team: 'some-team'
      } as any
    })
  );

  t.pass();
});

/**
 * NEGATIVE TESTS
 */

test.serial(
  'It should fail to create a new repository if missing required environment variables',
  async (t) => {
    process.env.REGION = '';
    process.env.TABLE_NAME = '';

    const data: SlotDTO = {
      slotId: 'string',
      hostName: 'string',
      timeSlot: {
        startTime: 'a',
        endTime: 'b'
      },
      slotStatus: 'OPEN',
      createdAt: 'string',
      updatedAt: 'string'
    };

    const error = await t.throwsAsync(async () => {
      const db = createDynamoDbRepository();
      await db.updateSlot(data);
    });

    t.is(error?.name, 'MissingEnvVarsError');
  }
);
