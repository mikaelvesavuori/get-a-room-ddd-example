import { ReservationService } from '../../domain/services/ReservationService';

import { createSlotLoaderService } from '../services/SlotLoaderService';

import { Dependencies } from '../../interfaces/Dependencies';
import { SlotId } from '../../interfaces/Slot';

/**
 * @description Use case to handle checking out from a slot.
 */
export async function CheckOutUseCase(dependencies: Dependencies, slotId: SlotId) {
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slotDto = await slotLoader.loadSlot(slotId);

  const reservationService = new ReservationService(dependencies);
  await reservationService.checkOut(slotDto);
}
