/**
 * @description Every slot has a starting and ending time.
 */
export type TimeSlotDTO = {
  /**
   * @description The starting time of the slot in ISO format.
   */
  startTime: string;
  /**
   * @description The ending time of the slot in ISO format.
   */
  endTime: string;
};
