/**
 * @description A `VerificationCodeService` abstracts getting room
 * verification codes.
 */
export interface VerificationCodeService {
  getVerificationCode(slotId: string): Promise<string>;
}
