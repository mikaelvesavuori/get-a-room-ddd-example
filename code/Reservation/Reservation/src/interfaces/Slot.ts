import { TimeSlotDTO } from './TimeSlot';

/**
 * @description Represents the data needed to create a slot.
 */
export interface SlotCreateInput {
  /**
   * @description Start time of the slot in ISO format.
   */
  startTime: string;
  /**
   * @description End time of the slot in ISO format.
   */
  endTime: string;
}

/**
 * @description Represents the valid and complete data of a
 * correctly shaped Slot entity.
 */
export interface SlotDTO {
  /**
   * @description The ID of this slot.
   */
  slotId: string;
  /**
   * @description The name of the host. Empty at first.
   */
  hostName: string;
  /**
   * @description The time object with start and end times.
   */
  timeSlot: TimeSlotDTO;
  /**
   * @description Status of the slot.
   */
  slotStatus: Status;
  /**
   * @description Time of creation of the slot using ISO format.
   */
  createdAt: string;
  /**
   * @description Time of last update of the slot using ISO format.
   */
  updatedAt: string;
}

/**
 * @description User-provided input for a Slot.
 */
export type SlotInput = {
  /**
   * @description The ID of this slot.
   */
  slotId: string;
  /**
   * @description The name of the host. Empty at first.
   */
  hostName: string;
};

/**
 * @description The ID of a slot.
 */
export type SlotId = string;

/**
 * @description Represents the steady states a slot can be in.
 */
export type Status = 'OPEN' | 'RESERVED' | 'CHECKED_IN' | 'CLOSED';
