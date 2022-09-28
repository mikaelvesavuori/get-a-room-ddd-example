import { DynamoItem, CleanedItem, Entry } from '../../interfaces/DynamoDb';
import { SlotDTO } from '../../interfaces/Slot';

/**
 * @description Clean up and return items in a normalized `SlotDTO` format.
 */
export function getCleanedItems(items: DynamoItem[]): SlotDTO[] {
  if (items && items.length > 0) return items.map((item: DynamoItem) => createCleanedItem(item));
  return [];
}

/**
 * @description Produce an object with a cleaned and restored format based on the input data.
 */
function createCleanedItem(item: DynamoItem): SlotDTO {
  const cleanedItem: CleanedItem = {};

  Object.entries(item).forEach((entry: Entry) => {
    const [key, value] = entry;
    const fixedKey = key === 'id' ? 'slotId' : key;
    const fixedValue: string =
      fixedKey === 'timeSlot' ? JSON.parse(Object.values(value)[0]) : Object.values(value)[0];
    cleanedItem[fixedKey] = fixedValue;
  });

  return cleanedItem as unknown as SlotDTO;
}
