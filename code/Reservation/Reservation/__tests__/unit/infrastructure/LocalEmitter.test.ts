import test from 'ava';

import { CreatedEvent } from '../../../src/domain/events/Event';

import { createLocalEmitter } from '../../../src/infrastructure/emitters/LocalEmitter';

import metadataConfig from '../../../testdata/metadataConfig.json';
import createdEvent from '../../../testdata/events/CreatedEvent.json';

import { cleanEnv, getValidated, setEnv } from '../../../testUtils';

const eventEmitter = createLocalEmitter();

test.beforeEach(() => setEnv());
test.afterEach(() => cleanEnv());

/**
 * POSITIVE TESTS
 */

test.serial('It should emit a valid event', async (t) => {
  const expected: any = createdEvent;

  const event = new CreatedEvent({
    event: {
      eventName: 'CREATED',
      slotId: 'test',
      slotStatus: 'OPEN',
      hostName: 'test',
      startTime: '2050-01-01'
    },
    metadataConfig: metadataConfig as any
  });

  const validated = getValidated(t, event, expected);

  t.deepEqual(validated.response, validated.expected);

  await eventEmitter.emit(event as any);

  t.pass();
});
