import { SlotDTO } from '../../interfaces/Slot';

import { MissingInputDataFieldError } from '../../errors/MissingInputDataFieldError';
import { MissingInputDataTimeError } from '../../errors/MissingInputDataTimeError';

/**
 * @description Validate and sanitize incoming input data.
 * @param onlyCheckReservationDataInput Used for reservations in which case we only have limited ingoing data.
 * @returns Validated and sanitized `SlotDTO`
 */
export function sanitizeInputData(
  data: Record<string, any>,
  onlyCheckReservationDataInput?: boolean
): SlotDTO {
  // Force data into a new object to get rid of anything dangerous that might have made it in
  const stringifiedData = JSON.stringify(data);
  const parsedData = JSON.parse(stringifiedData);

  // Verify presence of required fields
  const requiredFields = onlyCheckReservationDataInput
    ? ['slotId', 'hostName']
    : ['slotId', 'timeSlot', 'slotStatus', 'createdAt', 'updatedAt'];
  requiredFields.forEach((key: string) => {
    const value = parsedData[key];
    if (!value) throw new MissingInputDataFieldError();
    else if (key === 'timeSlot') {
      if (!parsedData['timeSlot']['startTime'] || !parsedData['timeSlot']['endTime'])
        throw new MissingInputDataTimeError();
    }
  });

  // Construct new Slot without any additional, non-required fields that might have been injected
  const reconstitutedSlot: Record<string, any> = {};
  Object.entries(data).forEach((entry: any) => {
    const [key, value] = entry;
    if (requiredFields.includes(key)) reconstitutedSlot[key] = value;
  });

  // Add `hostName` if one existed
  if (parsedData['hostName']) reconstitutedSlot['hostName'] = parsedData['hostName'];

  return reconstitutedSlot as SlotDTO;
}
