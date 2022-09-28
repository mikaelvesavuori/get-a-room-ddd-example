import { ReservationService } from '../../domain/services/ReservationService';

import { Dependencies } from '../../interfaces/Dependencies';

/**
 * @description Use case to handle creating the daily slots.
 */
export async function CreateSlotsUseCase(dependencies: Dependencies): Promise<string[]> {
  const reservationService = new ReservationService(dependencies);

  return await reservationService.makeDailySlots();
}
