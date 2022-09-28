import { DynamoItem, CleanedItem, Entry } from '../../interfaces/DynamoDb';
import { Slot } from '../../interfaces/Slot';

/**
 * @description Clean up and return items in a normalized format.
 */
export function getCleanedItems(items: DynamoItem[]): Slot[] {
  if (items && items.length > 0) return items.map((item: DynamoItem) => createCleanedItem(item));
  return [];
}

/**
 * @description Produce an object with a cleaned and restored format based on the input data.
 */
function createCleanedItem(item: DynamoItem): Slot {
  const cleanedItem: CleanedItem = {};

  Object.entries(item).forEach((entry: Entry) => {
    const [key, value] = entry;
    const fixedValue: string =
      key === 'timeSlot' ? JSON.parse(Object.values(value)[0]) : Object.values(value)[0];
    cleanedItem[key] = fixedValue;
  });

  return cleanedItem as Slot;
}
