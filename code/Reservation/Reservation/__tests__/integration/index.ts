import fetch from 'cross-fetch';
import Ajv from 'ajv';

import assertions from './assertions.json';

const INTEGRATION_ENDPOINT_BASE = 'https://RANDOM_STRING.execute-api.REGION.amazonaws.com/shared'; // TODO: EDIT THIS TO YOUR ENDPOINT

let verificationCode = '';

/**
 * Orchestrate integration test run.
 */
async function runIntegrationTests() {
  try {
    // 1. Create slots
    const slotIds = await fetchData(`${INTEGRATION_ENDPOINT_BASE}/CreateSlots`);
    const slotId = slotIds[0]; // Use the first slot for testing

    // 2. Run user-oriented tests
    for (const assertion of assertions) {
      await handleTestCase(assertion, slotId);
      console.log(); // Create an empty line to get some more spacing
      await wait();
    }

    console.log('✅ Passed integration tests');
  } catch (error) {
    console.log('❌ Failed integration tests');
  }
}

/**
 * @description Wrapper for fetching data.
 */
async function fetchData(
  url: string,
  body?: Record<string, any>,
  headers?: Record<string, any>
): Promise<any> {
  return await fetch(url, {
    headers,
    method: body ? 'POST' : 'GET',
    body: JSON.stringify(body)
  })
    .then(async (res: any) => {
      if (res.status >= 200 && res.status < 300) {
        if (res.status === 204) return 'OK'; // 204 means "No content", so set some dummy value just to connote it worked
        const contentType = res.headers.get('content-type');
        if (contentType === 'application/json') return res.json();
        return res.text();
      }
      throw new Error(`Status was unexpected: ${res.status}`);
    })
    .catch((error: any) => console.error(error));
}

/**
 * @description Handle the details around a given test case.
 */
async function handleTestCase(assertion: Record<string, any>, slotId: string) {
  const { name, path, payload, expectation, schema } = assertion;
  const { headers, body } = payload;

  console.log('Running integration test:\n', name);

  const response = await fetchData(
    `${INTEGRATION_ENDPOINT_BASE}/${path}`,
    {
      ...body,
      id: slotId
    },
    headers.Authorization && verificationCode
      ? {
        ...headers,
        Authorization: `${slotId}#${verificationCode}`
      }
      : headers
  );
  if (!response) throw new Error('❌ Test failed!');

  // After reserving the slot, make sure to store the verification code outside the context
  if (response.code) {
    console.log('Setting new verification code:', response.code);
    verificationCode = response.code;
  }

  /**
   * If there is an Ajv matching schema then use that to check,
   * else use an exact comparison for our check.
   */
  const isMatch = schema
    ? test(schema, expectation)
    : expectation
      ? JSON.stringify(response) === JSON.stringify(expectation)
      : true; // This is for any cases where the response will be empty

  if (isMatch) return true;
  return false;
}

/**
 * @description Validate a schema with Ajv.
 */
function test(schema: Record<string, any>, expectation: Record<string, any>): boolean {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(expectation);

  return valid ? true : false;
}

/**
 * @description Wait for a given period of time.
 */
async function wait(timeInMs = 1000) {
  return new Promise((resolve) => setTimeout(resolve, timeInMs));
}

// Start testing
runIntegrationTests();
