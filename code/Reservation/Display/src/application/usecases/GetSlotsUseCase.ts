import { Dependencies } from '../../interfaces/Dependencies';

/**
 * @description Get room slot projections.
 */
export async function GetSlotsUseCase(dependencies: Dependencies) {
  const { repository } = dependencies;
  return await repository.getSlots();
}
