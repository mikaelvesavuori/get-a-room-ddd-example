import test from 'ava';

import { createVerificationCodeService } from '../../../src/application/services/VerificationCodeService';

import { mockServer } from '../mocks';
import { cleanEnv, setEnv } from '../../../testUtils';

test.beforeEach(() => {
  setEnv();
  mockServer.listen();
});

test.afterEach(() => {
  cleanEnv();
  mockServer.resetHandlers();
});

test.after(() => {
  mockServer.close();
});

/**
 * NEGATIVE TESTS
 */

test.serial(
  'It should throw a MissingSecurityApiEndpoint if missing an environment variable for the Security service endpoint',
  async (t) => {
    const error = t.throws(() => createVerificationCodeService(''));

    t.is(error?.name, 'MissingSecurityApiEndpoint');
  }
);

test.serial(
  'It should throw a FailedGettingVerificationCodeError if the generateCode service fails the request',
  async (t) => {
    const verificationCodeService = createVerificationCodeService(
      'https://q5tfpxckuk.execute-api.eu-north-1.amazonaws.com/shared/generateCode-fail'
    );

    const error = await t.throwsAsync(
      async () => await verificationCodeService.getVerificationCode('something')
    );

    t.is(error?.name, 'FailedGettingVerificationCodeError');
  }
);
