import test from 'ava';

import { setCorrelationId, getCorrelationId } from '../../../src/infrastructure/utils/userMetadata';

/**
 * POSITIVE TESTS
 */

test.serial('It should set user metadata (correlation ID) through AWS EventBridge object', (t) => {
  const expected = 'asdf1234';
  setCorrelationId(
    {
      detail: {
        metadata: {
          correlationId: expected
        }
      }
    },
    {}
  );
  const response = getCorrelationId();

  t.is(response, expected);
  process.env.CORRELATION_ID = '';
});

test.serial('It should set user metadata (correlation ID) through AWS Lambda context', (t) => {
  const expected = 'asdf1234';
  setCorrelationId({}, { awsRequestId: expected });
  const response = getCorrelationId();

  t.is(response, expected);
  process.env.CORRELATION_ID = '';
});

test.serial(
  'It should set user metadata (correlation ID) to UNKNOWN if no matching accepted format is used as input',
  (t) => {
    const expected = 'UNKNOWN';
    setCorrelationId({}, {});
    const response = getCorrelationId();

    t.is(response, expected);
    process.env.CORRELATION_ID = '';
  }
);
