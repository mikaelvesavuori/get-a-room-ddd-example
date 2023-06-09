import { MikroLog } from 'mikrolog';

// Aggregates/Entities
import { Slot } from '../entities/Slot';

// Events
import {
  CancelledEvent,
  CheckedInEvent,
  CheckedOutEvent,
  ClosedEvent,
  CreatedEvent,
  OpenedEvent,
  ReservedEvent,
  UnattendedEvent
} from '../events/Event';

// Value objects
import { TimeSlot } from '../valueObjects/TimeSlot';

// Interfaces
import { SlotDTO, Status } from '../../interfaces/Slot';
import { Repository } from '../../interfaces/Repository';
import { Dependencies } from '../../interfaces/Dependencies';
import { ReserveOutput } from '../../interfaces/ReserveOutput';
import { MetadataConfigInput } from '../../interfaces/Metadata';
import { Event } from '../../interfaces/Event';
import { DomainEventPublisherService } from '../../interfaces/DomainEventPublisherService';
import { VerificationCodeService } from '../../interfaces/VerificationCodeService';

// Errors
import { MissingDependenciesError } from '../../errors/MissingDependenciesError';

/**
 * @description Acts as the aggregate for Slot reservations (representing rooms and
 * their availability), enforcing all the respective invariants ("statuses")
 * of the Slot entity.
 */
export class ReservationService {
  private readonly repository: Repository;
  private readonly metadataConfig: MetadataConfigInput;
  private readonly domainEventPublisher: DomainEventPublisherService;
  private readonly logger: MikroLog;

  constructor(dependencies: Dependencies) {
    if (!dependencies.repository || !dependencies.domainEventPublisher)
      throw new MissingDependenciesError();
    const { repository, domainEventPublisher, metadataConfig } = dependencies;

    this.repository = repository;
    this.metadataConfig = metadataConfig;
    this.domainEventPublisher = domainEventPublisher;
    this.logger = MikroLog.start();
  }

  /**
   * @description Utility to encapsulate the transactional boilerplate
   * such as calling the repository and event emitter.
   */
  private async transact(slotDto: SlotDTO, event: Event, newStatus: Status) {
    await this.repository
      .updateSlot(slotDto)
      .then(() => this.logger.log(`Updated status of '${slotDto.slotId}' to '${newStatus}'`));
    await this.repository.addEvent(event);
    await this.domainEventPublisher.publish(event);
  }

  /**
   * @description Make all the slots needed for a single day (same day/"today").
   *
   * "Zulu time" is used, where GMT+0 is the basis.
   *
   * @see https://time.is/Z
   */
  public async makeDailySlots(): Promise<string[]> {
    const slots: SlotDTO[] = [];

    const startHour = 6; // Zulu time (GMT) -> 08:00 in CEST
    const numberHours = 10;

    for (let slotCount = 0; slotCount < numberHours; slotCount++) {
      const hour = startHour + slotCount;
      const timeSlot = new TimeSlot().startingAt(hour);
      const slot = new Slot(timeSlot.get());
      slots.push(slot.toDto());
    }

    const dailySlots = slots.map(async (slotDto: SlotDTO) => {
      const slot = new Slot().fromDto(slotDto);
      const { slotId, hostName, slotStatus, timeSlot } = slot.toDto();

      const createdEvent = new CreatedEvent({
        event: {
          eventName: 'CREATED', // Transient state
          slotId,
          slotStatus,
          hostName,
          startTime: timeSlot.startTime
        },
        metadataConfig: this.metadataConfig
      });

      await this.transact(slot.toDto(), createdEvent, slotStatus);
    });

    await Promise.all(dailySlots);

    const slotIds = slots.map((slot: SlotDTO) => slot.slotId);
    return slotIds;
  }

  /**
   * @description Cancel a slot reservation.
   */
  public async cancel(slotDto: SlotDTO): Promise<void> {
    const slot = new Slot().fromDto(slotDto);
    const { event, newStatus } = slot.cancel();

    const cancelEvent = new CancelledEvent({
      event,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot.toDto(), cancelEvent, newStatus);
  }

  /**
   * @description Reserve a slot.
   */
  public async reserve(
    slotDto: SlotDTO,
    hostName: string,
    verificationCodeService: VerificationCodeService
  ): Promise<ReserveOutput> {
    const slot = new Slot().fromDto(slotDto);
    const { event, newStatus } = slot.reserve(hostName);

    const verificationCode = await verificationCodeService.getVerificationCode(slotDto.slotId);

    const reserveEvent = new ReservedEvent({
      event,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot.toDto(), reserveEvent, newStatus);

    return {
      code: verificationCode
    };
  }

  /**
   * @description Check in to a slot.
   */
  public async checkIn(slotDto: SlotDTO): Promise<void> {
    const slot = new Slot().fromDto(slotDto);
    const { event, newStatus } = slot.checkIn();

    const checkInEvent = new CheckedInEvent({
      event,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot.toDto(), checkInEvent, newStatus);
  }

  /**
   * @description Check out of a slot.
   */
  public async checkOut(slotDto: SlotDTO): Promise<void> {
    const slot = new Slot().fromDto(slotDto);
    const { event, newStatus } = slot.checkOut();

    const checkOutEvent = new CheckedOutEvent({
      event,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot.toDto(), checkOutEvent, newStatus);
  }

  /**
   * @description Re-open a slot.
   */
  public async open(slotDto: SlotDTO): Promise<void> {
    const slot = new Slot().fromDto(slotDto);
    const { event, newStatus } = slot.open();

    const openEvent = new OpenedEvent({
      event,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot.toDto(), openEvent, newStatus);
  }

  /**
   * @description Check for closed slots and set them as being in "closed" invariant state.
   *
   * This is only triggered by scheduled events.
   */
  public async checkForClosed(slotDtos: SlotDTO[]): Promise<void> {
    const updateSlots = slotDtos.map(async (slotDto: SlotDTO) => {
      const slot = new Slot().fromDto(slotDto);
      if (slot.isEnded()) return await this.close(slot);
    });

    await Promise.all(updateSlots);
  }

  /**
   * @description Close a slot.
   */
  private async close(slot: Slot): Promise<void> {
    const { event, newStatus } = slot.close();

    const closeEvent = new ClosedEvent({
      event,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot.toDto(), closeEvent, newStatus);
  }

  /**
   * @description Check for unattended slots.
   */
  public async checkForUnattended(slotDtos: SlotDTO[]): Promise<void> {
    const slotsToUpdate = slotDtos.filter(async (slotDto: SlotDTO) => {
      const slot = new Slot().fromDto(slotDto);
      if (slot.isGracePeriodOver()) return await this.unattend(slot);
    });

    await Promise.all(slotsToUpdate);
  }

  /**
   * @description Unattend a slot that has not been checked into.
   */
  private async unattend(slot: Slot): Promise<void> {
    const result = slot.unattend();
    if (!result) return;

    const { event, newStatus } = result;
    const unattendEvent = new UnattendedEvent({
      event,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot.toDto(), unattendEvent, newStatus);
  }
}
