import { randomUUID } from 'crypto';

import {
  EventInput,
  EventDetail,
  EventBridgeEvent,
  EventDTO,
  MakeEventInput,
  MetadataInput
} from '../../interfaces/Event';
import { Metadata, MetadataConfigInput } from '../../interfaces/Metadata';

import { getCorrelationId } from '../../infrastructure/utils/userMetadata';

import { MissingMetadataFieldsError } from '../../errors/MissingMetadataFieldsError';
import { NoMatchInEventCatalogError } from '../../errors/NoMatchInEventCatalogError';
import { MissingEnvVarsError } from '../../errors/MissingEnvVarsError';

/**
 * @description Vend a "Event Carried State Transfer" type event with state
 * that can be emitted with an emitter implementation.
 */
abstract class EmittableEvent {
  private readonly event: EventBridgeEvent;
  private readonly eventBusName: string;
  private readonly metadataConfig: MetadataConfigInput;

  constructor(eventInput: EventInput) {
    const { event, metadataConfig } = eventInput;
    this.eventBusName = process.env.DOMAIN_BUS_NAME || '';
    this.metadataConfig = metadataConfig;

    if (!this.eventBusName)
      throw new MissingEnvVarsError(
        JSON.stringify([{ key: 'DOMAIN_BUS_NAME', value: process.env.DOMAIN_BUS_NAME }])
      );

    const eventDTO = this.toDto(event);
    this.event = this.make(eventDTO);
  }

  /**
   * @description Make an intermediate Data Transfer Object that
   * contains all required information to vend out a full event.
   */
  private toDto(eventInput: MakeEventInput): EventDTO {
    const { eventName, slotId, slotStatus } = eventInput;

    const detailType = this.matchDetailType(eventName);
    const timeNow = Date.now();

    return {
      eventBusName: this.eventBusName,
      eventName,
      detailType,
      metadata: {
        ...this.metadataConfig,
        version: eventInput.version || 1,
        id: randomUUID().toString(),
        correlationId: getCorrelationId(),
        timestamp: new Date(timeNow).toISOString(),
        timestampEpoch: `${timeNow}`
      },
      data: {
        event: eventName,
        slotId,
        slotStatus,
        hostName: eventInput.hostName || '',
        startTime: eventInput.startTime || ''
      }
    };
  }

  /**
   * @description Produces a fully formed event that can be used with AWS EventBridge.
   */
  private make(eventDto: EventDTO): EventBridgeEvent {
    const { eventBusName, data, metadata, detailType } = eventDto;
    const { version, id, correlationId } = metadata;
    const source = `${metadata.domain?.toLowerCase()}.${metadata.system?.toLowerCase()}.${detailType.toLowerCase()}`;

    const detail: EventDetail = {
      metadata: this.produceMetadata({ version, id, correlationId }),
      data
    };

    return {
      EventBusName: eventBusName,
      Source: source,
      DetailType: detailType,
      Detail: JSON.stringify(detail)
    };
  }

  /**
   * @description Produce correct metadata format for the event.
   * @note The verbose format is used as we cannot make assumptions
   * on users actually passing in fully formed data.
   */
  private produceMetadata(metadataInput: MetadataInput): Metadata {
    const { version, id, correlationId } = metadataInput;

    if (
      !version ||
      !this.metadataConfig.lifecycleStage ||
      !this.metadataConfig.domain ||
      !this.metadataConfig.system ||
      !this.metadataConfig.service ||
      !this.metadataConfig.team
    )
      throw new MissingMetadataFieldsError(metadataInput);

    const timeNow = Date.now();

    return {
      timestamp: new Date(timeNow).toISOString(),
      timestampEpoch: `${timeNow}`,
      id,
      correlationId,
      version,
      lifecycleStage: this.metadataConfig.lifecycleStage,
      domain: this.metadataConfig.domain,
      system: this.metadataConfig.system,
      service: this.metadataConfig.service,
      team: this.metadataConfig.team,
      hostPlatform: this.metadataConfig.hostPlatform,
      owner: this.metadataConfig.owner,
      region: this.metadataConfig.region,
      jurisdiction: this.metadataConfig.jurisdiction,
      tags: this.metadataConfig.tags,
      dataSensitivity: this.metadataConfig.dataSensitivity
    };
  }

  /**
   * @description Pick out matching `detail-type` field from event names.
   * @note Should be refactored to regex solution if this grows.
   */
  private matchDetailType(eventName: string) {
    switch (eventName) {
      // User interaction events
      case 'CREATED':
        return 'Created';
      case 'CANCELLED':
        return 'Cancelled';
      case 'RESERVED':
        return 'Reserved';
      case 'CHECKED_IN':
        return 'CheckedIn';
      case 'CHECKED_OUT':
        return 'CheckedOut';
      case 'UNATTENDED':
        return 'Unattended';
      // System interaction events
      case 'OPENED':
        return 'Opened';
      case 'CLOSED':
        return 'Closed';
    }

    throw new NoMatchInEventCatalogError(eventName);
  }

  /**
   * @description Get event payload.
   */
  public get() {
    return this.event;
  }

  /**
   * @description Return modified DTO variant for analytics purposes.
   * Use "Notification" type event without state.
   */
  public getAnalyticsVariant(analyticsBusName: string): EventBridgeEvent {
    const analyticsEvent: EventBridgeEvent = JSON.parse(JSON.stringify(this.get()));
    const detail = JSON.parse(analyticsEvent.Detail);

    analyticsEvent['EventBusName'] = analyticsBusName;
    detail['metadata']['id'] = randomUUID().toString();
    if (detail.data?.slotStatus) delete detail['data']['slotStatus'];

    analyticsEvent['Detail'] = JSON.stringify(detail);

    return analyticsEvent;
  }
}

/**
 * @description An event that represents the `Created` invariant state.
 */
export class CreatedEvent extends EmittableEvent {
  //
}

/**
 * @description An event that represents the `Cancelled` invariant state.
 */
export class CancelledEvent extends EmittableEvent {
  //
}

/**
 * @description An event that represents the `Reserved` invariant state.
 */
export class ReservedEvent extends EmittableEvent {
  //
}

/**
 * @description An event that represents the `CheckedIn` invariant state.
 */
export class CheckedInEvent extends EmittableEvent {
  //
}

/**
 * @description An event that represents the `CheckedOut` invariant state.
 */
export class CheckedOutEvent extends EmittableEvent {
  //
}

/**
 * @description An event that represents the `Unattended` invariant state.
 */
export class UnattendedEvent extends EmittableEvent {
  //
}

/**
 * @description An event that represents the `Open` invariant state.
 */
export class OpenedEvent extends EmittableEvent {
  //
}

/**
 * @description An event that represents the `Closed` invariant state.
 */
export class ClosedEvent extends EmittableEvent {
  //
}
