import { EventBridgeEvent } from './Event';

/**
 * @description The `EventEmitter` is what we use to emit
 * domain events and integration events into our landscape.
 */
export interface EventEmitter {
  /**
   * @description Emit an event.
   */
  emit: (event: EventBridgeEvent) => Promise<void>;
}
