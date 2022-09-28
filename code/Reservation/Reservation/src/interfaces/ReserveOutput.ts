/**
 * @description Output for "reserve" use case which includes the verification code.
 */
export type ReserveOutput = {
  code: VerificationCode;
};

/**
 * @description Verification code for room slot.
 */
export type VerificationCode = string;
