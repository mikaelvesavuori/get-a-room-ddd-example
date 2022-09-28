import { randomUUID } from 'crypto';

import { GeneratedVerificationCode } from '../../interfaces/GeneratedVerificationCode';

/**
 * @description Factory function to create new `VerificationCode` instance.
 */
export function createVerificationCode() {
  return new VerificationCode();
}

/**
 * @description Verification code value object.
 */
class VerificationCode {
  /**
   * @description Generates a verification code using the
   * first 8 characters of a UUID (version 4).
   */
  generate(): GeneratedVerificationCode {
    return randomUUID().slice(0, 8);
  }
}
