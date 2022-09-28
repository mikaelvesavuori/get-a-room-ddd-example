import test from 'ava';

import { CreatedEvent } from '../../../src/domain/events/Event';

import { createEventBridgeEmitter } from '../../../src/infrastructure/emitters/EventBridgeEmitter';

import metadataConfig from '../../../testdata/metadataConfig.json';
import createdEvent from '../../../testdata/events/CreatedEvent.json';

import { cleanEnv, getValidated, setEnv } from '../../../testUtils';

test.beforeEach(() => setEnv());
test.afterEach(() => cleanEnv());

const eventEmitter = createEventBridgeEmitter('some-region');

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
