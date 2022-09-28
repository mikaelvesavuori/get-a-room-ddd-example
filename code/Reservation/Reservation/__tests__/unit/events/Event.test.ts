import test from 'ava';

import { ClosedEvent, CreatedEvent, OpenedEvent } from '../../../src/domain/events/Event';
import { CancelledEvent } from '../../../src/domain/events/Event';
import { ReservedEvent } from '../../../src/domain/events/Event';
import { CheckedInEvent } from '../../../src/domain/events/Event';
import { CheckedOutEvent } from '../../../src/domain/events/Event';
import { UnattendedEvent } from '../../../src/domain/events/Event';

import metadataConfig from '../../../testdata/metadataConfig.json';
import createdEvent from '../../../testdata/events/CreatedEvent.json';
import cancelledEvent from '../../../testdata/events/CancelledEvent.json';
import reservedEvent from '../../../testdata/events/ReservedEvent.json';
import checkedInEvent from '../../../testdata/events/CheckedInEvent.json';
import checkedOutEvent from '../../../testdata/events/CheckedOutEvent.json';
import unattendedEvent from '../../../testdata/events/UnattendedEvent.json';
import closedEvent from '../../../testdata/events/ClosedEvent.json';
import openedEvent from '../../../testdata/events/OpenedEvent.json';
import unattendedEventAnalytics from '../../../testdata/events/UnattendedEventAnalytics.json';

import { cleanEnv, setEnv, getValidated } from '../../../testUtils';

test.beforeEach(() => setEnv());
test.afterEach(() => cleanEnv());

/**
 * POSITIVE TESTS
 */

test.serial('It should create a new CreatedEvent', (t) => {
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
});

test.serial('It should create a new CancelledEvent', (t) => {
  const expected: any = cancelledEvent;

  const event = new CancelledEvent({
    event: {
      eventName: 'CANCELLED',
      slotId: 'test',
      slotStatus: 'RESERVED',
      hostName: 'test',
      startTime: '2050-01-01'
    },
    metadataConfig: metadataConfig as any
  });

  const validated = getValidated(t, event, expected);

  t.deepEqual(validated.response, validated.expected);
});

test.serial('It should create a new ReservedEvent', (t) => {
  const expected: any = reservedEvent;

  const event = new ReservedEvent({
    event: {
      eventName: 'RESERVED',
      slotId: 'test',
      slotStatus: 'RESERVED',
      hostName: 'test',
      startTime: '2050-01-01'
    },
    metadataConfig: metadataConfig as any
  });

  const validated = getValidated(t, event, expected);

  t.deepEqual(validated.response, validated.expected);
});

test.serial('It should create a new CheckedInEvent', (t) => {
  const expected: any = checkedInEvent;

  const event = new CheckedInEvent({
    event: {
      eventName: 'CHECKED_IN',
      slotId: 'test',
      slotStatus: 'CHECKED_IN',
      hostName: 'test',
      startTime: '2050-01-01'
    },
    metadataConfig: metadataConfig as any
  });

  const validated = getValidated(t, event, expected);

  t.deepEqual(validated.response, validated.expected);
});

test.serial('It should create a new CheckedOutEvent', (t) => {
  const expected: any = checkedOutEvent;

  const event = new CheckedOutEvent({
    event: {
      eventName: 'CHECKED_OUT',
      slotId: 'test',
      slotStatus: 'OPEN',
      hostName: 'test',
      startTime: '2050-01-01'
    },
    metadataConfig: metadataConfig as any
  });

  const validated = getValidated(t, event, expected);

  t.deepEqual(validated.response, validated.expected);
});

test.serial('It should create a new UnattendedEvent', (t) => {
  const expected: any = unattendedEvent;

  const event = new UnattendedEvent({
    event: {
      eventName: 'UNATTENDED',
      slotId: 'test',
      slotStatus: 'OPEN',
      hostName: 'test',
      startTime: '2050-01-01'
    },
    metadataConfig: metadataConfig as any
  });

  const validated = getValidated(t, event, expected);

  t.deepEqual(validated.response, validated.expected);
});

test.serial('It should create a new ClosedEvent', (t) => {
  const expected: any = closedEvent;

  const event = new ClosedEvent({
    event: {
      eventName: 'CLOSED',
      slotId: 'test',
      slotStatus: 'CLOSED',
      hostName: 'test',
      startTime: '2050-01-01'
    },
    metadataConfig: metadataConfig as any
  });

  const validated = getValidated(t, event, expected);

  t.deepEqual(validated.response, validated.expected);
});

test.serial('It should create a new OpenedEvent', (t) => {
  const expected: any = openedEvent;

  const event = new OpenedEvent({
    event: {
      eventName: 'OPENED',
      slotId: 'test',
      slotStatus: 'OPEN',
      hostName: 'test',
      startTime: '2050-01-01'
    },
    metadataConfig: metadataConfig as any
  });

  const validated = getValidated(t, event, expected);

  t.deepEqual(validated.response, validated.expected);
});

test.serial('It should get the analytics version of an event', (t) => {
  const expected: any = unattendedEventAnalytics;

  const event = new UnattendedEvent({
    event: {
      eventName: 'UNATTENDED',
      slotId: 'test',
      slotStatus: 'OPEN',
      hostName: 'test',
      startTime: '2050-01-01'
    },
    metadataConfig: metadataConfig as any
  });

  const validated = getValidated(t, event, expected, true);

  t.deepEqual(validated.response, validated.expected);
});

/**
 * NEGATIVE TESTS
 */

test.serial('It should throw a NoMatchInEventCatalogError', (t) => {
  const error = t.throws(
    () =>
      new CreatedEvent({
        event: {
          eventName: 'does-not-exist' as any,
          slotId: 'test',
          slotStatus: 'OPEN',
          hostName: 'test',
          startTime: '2050-01-01'
        },
        metadataConfig: metadataConfig as any
      })
  );

  t.is(error?.name, 'NoMatchInEventCatalogError');
});

test.serial('It should throw a MissingMetadataFieldsError', (t) => {
  const error = t.throws(
    () =>
      new CreatedEvent({
        event: {
          eventName: 'CREATED',
          slotId: 'test',
          slotStatus: 'OPEN',
          hostName: 'test',
          startTime: '2050-01-01'
        },
        metadataConfig: {} as any
      })
  );

  t.is(error?.name, 'MissingMetadataFieldsError');
});
