import { ReservationService } from '../../domain/services/ReservationService';

import { createVerificationCodeService } from '../services/VerificationCodeService';

import { Dependencies } from '../../interfaces/Dependencies';
import { ReserveOutput } from '../../interfaces/ReserveOutput';
import { SlotInput } from '../../interfaces/Slot';
import { createSlotLoaderService } from '../services/SlotLoaderService';

/**
 * @description Use case to handle reserving a slot.
 */
export async function ReserveSlotUseCase(
  dependencies: Dependencies,
  slotInput: SlotInput
): Promise<ReserveOutput> {
  const securityApiEndpoint = process.env.SECURITY_API_ENDPOINT_GENERATE || '';

  const { slotId, hostName } = slotInput;
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slotDto = await slotLoader.loadSlot(slotId);

  const verificationCodeService = createVerificationCodeService(securityApiEndpoint);
  const reservationService = new ReservationService(dependencies);

  return await reservationService.reserve(slotDto, hostName, verificationCodeService);
}
