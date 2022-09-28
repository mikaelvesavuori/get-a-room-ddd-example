import { Event } from './Event';
import { EventEmitter } from './EventEmitter';

/**
 * @description The `DomainEventPublisherService` makes it easy to
 * emit domain events.
 */
export interface DomainEventPublisherService {
  publish(event: Event): Promise<void>;
}

/**
 * @description Required dependencies for instantiating
 * a new `DomainEventPublisherService`.
 */
export type DomainEventPublisherDependencies = {
  /**
   * @description Event emitter implementation.
   */
  eventEmitter: EventEmitter;
};
