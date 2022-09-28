import { createVerificationCode } from '../../domain/valueObjects/VerificationCode';

import { GenerateCodeInput } from '../../interfaces/GenerateCodeInput';
import { GeneratedVerificationCode } from '../../interfaces/GeneratedVerificationCode';
import { Repository } from '../../interfaces/Repository';

/**
 * @description Generate verification code.
 */
export async function GenerateCodeUseCase(
  repository: Repository,
  data: GenerateCodeInput
): Promise<GeneratedVerificationCode> {
  const { slotId } = data;

  const code = createVerificationCode();
  const verificationCode = code.generate();

  /**
   * We need to add and store this code in the repository or
   * we won't be able to verify reservations against anything.
   */
  await repository.addCode(verificationCode, slotId);

  return verificationCode;
}
