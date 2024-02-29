import { sanitizeInputData } from './sanitizeInputData';

import { Repository } from '../../interfaces/Repository';
import { SlotDTO, SlotId } from '../../interfaces/Slot';

import { MissingSlotError } from '../../errors/MissingSlotError';

/**
 * @description Factory function to create `SlotLoaderService` instance.
 */
export function createSlotLoaderService(repository: Repository) {
  return new SlotLoaderService(repository);
}

/**
 * @description The `SlotLoaderService` is a convenience service to retrieve
 * `SlotDTO`s from a repository.
 */
class SlotLoaderService {
  private readonly repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  /**
   * @description Utility to load and validate multiple items from repository.
   */
  async loadSlots(): Promise<SlotDTO[]> {
    const items = await this.repository.loadSlots();
    return items.map((item: Record<string, any>) => sanitizeInputData(item));
  }

  /**
   * @description Utility to load and validate data single item from repository.
   */
  async loadSlot(slotId: SlotId): Promise<SlotDTO> {
    const data = await this.repository.loadSlot(slotId);
    if (data) return sanitizeInputData(data);

    throw new MissingSlotError();
  }
}
