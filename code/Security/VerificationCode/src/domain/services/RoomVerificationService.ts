import { GeneratedVerificationCode } from '../../interfaces/GeneratedVerificationCode';

/**
 * @description Factory function to create a new `RoomVerificationService` instance.
 */
export function createRoomVerificationService() {
  return new RoomVerificationService();
}

/**
 * @description Controls all operations that deal with verification codes for time slots.
 */
class RoomVerificationService {
  /**
   * @description Verify a code.
   */
  public verifyCode(code: string, verificationCode: GeneratedVerificationCode): boolean {
    return code === verificationCode;
  }
}
