import { ReservationService } from '../../domain/services/ReservationService';

import { createSlotLoaderService } from '../services/SlotLoaderService';

import { Dependencies } from '../../interfaces/Dependencies';
import { SlotId } from '../../interfaces/Slot';

/**
 * @description Use case to handle cancelling a slot.
 */
export async function CancelSlotUseCase(dependencies: Dependencies, slotId: SlotId): Promise<void> {
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slotDto = await slotLoader.loadSlot(slotId);

  const reservationService = new ReservationService(dependencies);
  await reservationService.cancel(slotDto);
}
