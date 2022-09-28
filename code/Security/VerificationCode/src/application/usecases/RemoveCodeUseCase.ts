import { RemoveCodeInput } from '../../interfaces/RemoveCodeInput';
import { Repository } from '../../interfaces/Repository';

/**
 * @description Remove code use case.
 */
export async function RemoveCodeUseCase(
  repository: Repository,
  data: RemoveCodeInput
): Promise<void> {
  const { slotId } = data;
  await repository.removeCode(slotId);
}
