import { randomUUID } from 'crypto';

import { SlotCreateInput, SlotDTO, Status } from '../../interfaces/Slot';
import { TimeSlotDTO } from '../../interfaces/TimeSlot';
import { MakeEventInput } from '../../interfaces/Event';

import { CheckInConditionsNotMetError } from '../../errors/CheckInConditionsNotMetError';
import { CheckOutConditionsNotMetError } from '../../errors/CheckOutConditionsNotMetError';
import { CancellationConditionsNotMetError } from '../../errors/CancellationConditionsNotMetError';
import { ReservationConditionsNotMetError } from '../../errors/ReservationConditionsNotMetError';

/**
 * @description The `Slot` entity handles the lifecycle
 * and operations of the (time) slots that users can
 * reserve.
 *
 * @example You can create it at once:
 * ```
 * const slot = new Slot({
 *   startTime: "2022-07-29T12:00:00.000Z",
 *   endTime: "2022-07-29T13:00:00.000Z"
 * });
 * ```
 *
 * You can also reconstitute a Slot from a SlotDTO
 * loaded from a repository:
 * ```
 * const slot = new Slot().fromDto(slotDto);
 * ```
 */
export class Slot {
  private slotId: string;
  private hostName: string;
  private timeSlot: TimeSlotDTO;
  private slotStatus: Status;
  private createdAt: string;
  private updatedAt: string;

  constructor(input?: SlotCreateInput) {
    this.slotId = '';
    this.hostName = '';
    this.timeSlot = {
      startTime: '',
      endTime: ''
    };
    this.slotStatus = 'OPEN';
    this.createdAt = '';
    this.updatedAt = '';

    if (input) this.make(input);
  }

  /**
   * @description Create a valid, starting-state ("open") invariant of the Slot.
   */
  private make(input: SlotCreateInput): SlotDTO {
    const { startTime, endTime } = input;
    const currentTime = this.getCurrentTime();

    this.slotId = randomUUID().toString();
    this.hostName = '';
    this.timeSlot = {
      startTime,
      endTime
    };
    this.slotStatus = 'OPEN';
    this.createdAt = currentTime;
    this.updatedAt = currentTime;

    return this.toDto();
  }

  /**
   * @description Reconstitute a Slot from a Data Transfer Object.
   */
  public fromDto(input: SlotDTO): Slot {
    this.slotId = input['slotId'];
    this.hostName = input['hostName'];
    this.timeSlot = input['timeSlot'];
    this.slotStatus = input['slotStatus'];
    this.createdAt = input['createdAt'];
    this.updatedAt = input['updatedAt'];

    return this;
  }

  /**
   * @description Return data as Data Transfer Object.
   */
  public toDto(): SlotDTO {
    return {
      slotId: this.slotId,
      hostName: this.hostName,
      timeSlot: this.timeSlot,
      slotStatus: this.slotStatus,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * @description Remove host name from data.
   */
  public removeHostName(): void {
    this.hostName = '';
  }

  /**
   * @description Update host name to new value.
   */
  public updateHostName(hostName: string): void {
    this.hostName = hostName;
  }

  /**
   * @description Updates the common fields to reflect a new `Status`,
   * and also updates the `updatedAt` field.
   *
   */
  public updateStatus(status: Status): void {
    this.slotStatus = status;
    this.updatedAt = this.getCurrentTime();
  }

  /**
   * @description Returns the start time of the time slot.
   */
  private getStartTime(): string {
    return this.timeSlot.startTime;
  }

  /**
   * @description Has the time slot's end time already passed?
   */
  public isEnded(): boolean {
    if (this.getCurrentTime() > this.timeSlot.endTime) return true;
    return false;
  }

  /**
   * @description Check if our 10 minute grace period has ended,
   * in which case we want to open the slot again.
   */
  public isGracePeriodOver(): boolean {
    if (this.getCurrentTime() > this.getGracePeriodEndTime(this.timeSlot.startTime)) return true;
    return false;
  }

  /**
   * @description Returns the end of the grace period until a reserved
   * slot is deemed unattended and returns to open state.
   */
  private getGracePeriodEndTime(startTime: string): string {
    const minutes = 10;
    const msPerMinute = 60 * 1000;

    return new Date(new Date(startTime).getTime() + minutes * msPerMinute).toISOString();
  }

  /**
   * @description Returns the current time as an ISO string.
   */
  private getCurrentTime(): string {
    return new Date().toISOString();
  }

  /**
   * @description Can this `Slot` be cancelled?
   */
  private canBeCancelled(): boolean {
    if (this.slotStatus !== 'RESERVED') return false;
    return true;
  }

  /**
   * @description Can this `Slot` be reserved?
   */
  private canBeReserved(): boolean {
    if (this.slotStatus !== 'OPEN') return false;
    return true;
  }

  /**
   * @description Can this `Slot` be checked in to?
   */
  private canBeCheckedInTo(): boolean {
    if (this.slotStatus !== 'RESERVED') return false;
    return true;
  }

  /**
   * @description Can this `Slot` be checked out of?
   */
  private canBeCheckedOutOf(): boolean {
    if (this.slotStatus !== 'CHECKED_IN') return false;
    return true;
  }

  /**
   * @description Can this `Slot` be unattended?
   */
  private canBeUnattended(): boolean {
    if (this.slotStatus === 'RESERVED') return true;
    return false;
  }

  /**
   * @description Updates a Slot to be in `OPEN` invariant state by cancelling the current state.
   *
   * Can only be performed in `RESERVED` state.
   *
   * @emits `CANCELLED`
   */
  public cancel(): SlotCommand {
    if (!this.canBeCancelled()) throw new CancellationConditionsNotMetError(this.slotStatus);

    const newStatus = 'OPEN';

    this.removeHostName();
    this.updateStatus(newStatus);

    return {
      event: {
        eventName: 'CANCELLED', // Transient state
        slotId: this.slotId,
        slotStatus: this.slotStatus,
        hostName: this.hostName,
        startTime: this.getStartTime()
      },
      newStatus
    };
  }

  /**
   * @description Updates a Slot to be in `RESERVED` invariant state.
   *
   * Can only be performed in `OPEN` state.
   *
   * @emits `RESERVED`
   */
  public reserve(hostName: string): SlotCommand {
    if (!this.canBeReserved()) throw new ReservationConditionsNotMetError(this.slotStatus);

    const newStatus = 'RESERVED';

    this.updateHostName(hostName || '');
    this.updateStatus(newStatus);

    return {
      event: {
        eventName: newStatus,
        slotId: this.slotId,
        slotStatus: newStatus,
        hostName: this.hostName,
        startTime: this.getStartTime()
      },
      newStatus
    };
  }

  /**
   * @description Updates a Slot to be in `CHECKED_IN` invariant state.
   *
   * Can only be performed in `RESERVED` state.
   *
   * @emits `CHECKED_IN`
   */
  public checkIn(): SlotCommand {
    if (!this.canBeCheckedInTo()) throw new CheckInConditionsNotMetError(this.slotStatus);

    const newStatus = 'CHECKED_IN';
    this.updateStatus(newStatus);

    return {
      event: {
        eventName: newStatus,
        slotId: this.slotId,
        slotStatus: newStatus,
        hostName: this.hostName,
        startTime: this.getStartTime()
      },
      newStatus
    };
  }

  /**
   * @description Updates a Slot to be in `OPEN` invariant state by checking out from the current state.
   *
   * Can only be performed in `CHECKED_IN` state.
   *
   * @emits `CHECKED_OUT`
   */
  public checkOut(): SlotCommand {
    if (!this.canBeCheckedOutOf()) throw new CheckOutConditionsNotMetError(this.slotStatus);

    const newStatus = 'OPEN';
    this.updateStatus(newStatus);
    this.removeHostName();

    return {
      event: {
        eventName: 'CHECKED_OUT', // Transient state
        slotId: this.slotId,
        slotStatus: newStatus,
        hostName: this.hostName,
        startTime: this.getStartTime()
      },
      newStatus
    };
  }

  /**
   * @description Updates a Slot to be in "open" invariant state.
   *
   * @emits `OPENED`
   */
  public open(): SlotCommand {
    const newStatus = 'OPEN';
    this.updateStatus(newStatus);

    return {
      event: {
        eventName: 'OPENED',
        slotId: this.slotId,
        slotStatus: newStatus,
        hostName: '',
        startTime: this.getStartTime()
      },
      newStatus
    };
  }

  /**
   * @description Updates a Slot to be in "closed" invariant state.
   *
   * @emits `CLOSED`
   */
  public close(): SlotCommand {
    const newStatus = 'CLOSED';
    this.updateStatus(newStatus);

    return {
      event: {
        eventName: newStatus,
        slotId: this.slotId,
        slotStatus: newStatus,
        hostName: this.hostName,
        startTime: this.getStartTime()
      },
      newStatus
    };
  }

  /**
   * @description Set a slot as being in `OPEN` invariant state if it is unattended.
   *
   * State change can only be performed in `RESERVED` state.
   *
   * This is only triggered by scheduled events.
   *
   * @emits `UNATTENDED`
   */
  public unattend(): SlotCommand | void {
    if (!this.canBeUnattended()) return;

    const newStatus = 'OPEN';
    this.updateStatus(newStatus);
    this.removeHostName();

    return {
      event: {
        eventName: 'UNATTENDED', // Transient state
        slotId: this.slotId,
        slotStatus: newStatus,
        hostName: this.hostName,
        startTime: this.getStartTime()
      },
      newStatus
    };
  }
}

/**
 * @description The finishing command that the `Slot` sends back when done.
 */
export interface SlotCommand {
  event: MakeEventInput;
  newStatus: Status;
}
