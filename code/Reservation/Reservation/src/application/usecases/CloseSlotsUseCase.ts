import { ReservationService } from '../../domain/services/ReservationService';

import { createSlotLoaderService } from '../services/SlotLoaderService';

import { Dependencies } from '../../interfaces/Dependencies';

/**
 * @description Use case to handle setting a slot as closed.
 */
export async function CloseSlotsUseCase(dependencies: Dependencies) {
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slots = await slotLoader.loadSlots();

  const reservationService = new ReservationService(dependencies);
  await reservationService.checkForClosed(slots);
}
