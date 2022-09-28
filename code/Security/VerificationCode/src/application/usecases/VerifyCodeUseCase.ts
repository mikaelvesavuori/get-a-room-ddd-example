import { createRoomVerificationService } from '../../domain/services/RoomVerificationService';

import { Repository } from '../../interfaces/Repository';
import { VerifyCodeInput } from '../../interfaces/VerifyCodeInput';

/**
 * @description Use case that verifies a code.
 */
export async function VerifyCodeUseCase(
  repository: Repository,
  data: VerifyCodeInput
): Promise<boolean> {
  const { verificationCode, slotId } = data;
  const code = await repository.getCode(slotId);

  const roomVerification = createRoomVerificationService();
  return roomVerification.verifyCode(code, verificationCode);
}
