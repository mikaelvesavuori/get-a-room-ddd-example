import { Dependencies } from '../../interfaces/Dependencies';
import { Slot } from '../../interfaces/Slot';

/**
 * @description Update room slot projections.
 */
export async function UpdateSlotUseCase(dependencies: Dependencies, slot: Slot) {
  const { repository } = dependencies;
  await repository.add(slot);
}
