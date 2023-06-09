import { TimeSlotDTO } from '../../interfaces/TimeSlot';

import { InvalidHourCountError } from '../../errors/InvalidHourCountError';

/**
 * @description Handles the creation of valid time objects.
 */
export class TimeSlot {
  private startTime = '';
  private endTime = '';

  /**
   * @description Creates a valid time object. Requires an `hour` provided as
   * a number as input for the starting hour. Assumes 24 hour clock.
   *
   * All time slots are 1 hour long and provided as ISO strings.
   * @example ```
   * const timeSlot = new TimeSlot().startingAt(8);
   * ```
   */
  public startingAt(hour: number): TimeSlot {
    if (hour > 24) throw new InvalidHourCountError();
    if (hour <= 0) hour = 0;

    const startHour = hour.toString().length === 1 ? `0${hour}` : `${hour}`;
    const endHour = (hour + 1).toString().length === 1 ? `0${hour + 1}` : `${hour + 1}`;
    const day = new Date(Date.now()).toISOString().substring(0, 10);
    const startTime = new Date(`${day}T${startHour}:00:00`).toISOString();
    const endTime = new Date(`${day}T${endHour}:00:00`).toISOString();

    this.startTime = startTime;
    this.endTime = endTime;

    return this;
  }

  /**
   * @description Returns a `TimeSlotDTO` for the start and end time.
   */
  public get(): TimeSlotDTO {
    return {
      startTime: this.startTime,
      endTime: this.endTime
    };
  }
}
