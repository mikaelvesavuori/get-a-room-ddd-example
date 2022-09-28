import { SlotId, Status } from './Slot';
import { Metadata, MetadataConfigInput } from './Metadata';

/**
 * @description Represents emittable events.
 */
export interface Event {
  get: () => EventBridgeEvent;
  getAnalyticsVariant: (analyticsBusName: string) => EventBridgeEvent;
}

/**
 * @description Input that is required when calling the `Event` class.
 */
export type EventInput = {
  event: MakeEventInput;
  metadataConfig: MetadataConfigInput;
};

/**
 * @description Input required to create an EventBridgeEvent's `metadata` object.
 */
export type MetadataInput = {
  id: string;
  correlationId: string;
  version: number;
};

/**
 * @description Input needed to make an intermediate Data Transfer Object that contains
 * all required information to vend out a full event.
 */
export type MakeEventInput = {
  /**
   * @description The type of user interaction event that has occurred.
   */
  eventName: UserInteractionEvent | SystemInteractionEvent;
  /**
   * @description The slot ID relating to this event.
   */
  slotId: SlotId;
  /**
   * @description Status of the slot.
   */
  slotStatus: Status;
  /**
   * @description Optional. The version of the event.
   */
  version?: number;
  /**
   * @description The name of the host. Used for analytical events.
   */
  hostName?: string;
  /**
   * @description Start time of the slot in ISO format. Used for analytical events.
   */
  startTime?: string;
};

/**
 * @description Complete event input used before `EventCatalog`
 * adds dynamically produced metadata (and any other changes).
 */
export type EventDTO = {
  /**
   * @description The EventBridge bus to publish to.
   */
  eventBusName: string;
  /**
   * @description The EventBridge detail type that this event represents.
   */
  detailType: DetailType;
  /**
   * @description The name of the event.
   */
  eventName: string;
  /**
   * @description Metadata for the event DTO.
   */
  metadata: Metadata;
  /**
   * @description Data for the event.
   */
  data: Data;
};

/**
 * @description The shape of an input into EventBridge.
 */
export type EventBridgeEvent = {
  /**
   * @description Name of the EventBridge bus.
   */
  EventBusName: string;
  /**
   * @description Source of the event.
   */
  Source: string;
  /**
   * @description The type of event.
   */
  DetailType: DetailType;
  /**
   * @description Input data as string.
   */
  Detail: string;
};

/**
 * @description Events must include data as well as metadata.
 */
export type EventDetail = {
  /**
   * @description Metadata for the event.
   */
  metadata: Metadata;
  /**
   * @description Data for the event.
   */
  data: Data;
};

/**
 * @description Event data can be either an object or a string.
 */
type Data = Record<string, any> | string;

/**
 * @description Represents valid user interaction events.
 */
type UserInteractionEvent =
  | 'CREATED'
  | 'CANCELLED'
  | 'UNATTENDED'
  | 'RESERVED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT';

/**
 * @description Represents valid system interaction events.
 */
type SystemInteractionEvent = 'OPENED' | 'CLOSED';

/**
 * @description Valid EventBridge detail types.
 */
export type DetailType = UserInteractedDetailType | SystemInteractedDetailType;

/**
 * @description Detail types that come from user interactions.
 */
type UserInteractedDetailType =
  | 'Created'
  | 'Cancelled'
  | 'Unattended'
  | 'Reserved'
  | 'CheckedIn'
  | 'CheckedOut';

/**
 * @description Detail types that come from system interactions.
 */
type SystemInteractedDetailType = 'Opened' | 'Closed';
