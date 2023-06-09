import { MikroLog } from 'mikrolog';

import { Event } from '../../interfaces/Event';
import {
  DomainEventPublisherDependencies,
  DomainEventPublisherService
} from '../../interfaces/DomainEventPublisherService';
import { EventEmitter } from '../../interfaces/EventEmitter';

import { MissingDependenciesError } from '../../errors/MissingDependenciesError';
import { MissingEnvVarsError } from '../../errors/MissingEnvVarsError';

/**
 * @description Factory function to set up the `DomainEventPublisherService`.
 */
export function createDomainEventPublisherService(dependencies: DomainEventPublisherDependencies) {
  return new ConcreteDomainEventPublisherService(dependencies);
}

/**
 * @description Service to publish domain events.
 */
class ConcreteDomainEventPublisherService implements DomainEventPublisherService {
  private readonly eventEmitter: EventEmitter;
  private readonly analyticsBusName: string;
  private readonly domainBusName: string;
  private readonly logger: MikroLog;

  constructor(dependencies: DomainEventPublisherDependencies) {
    if (!dependencies.eventEmitter) throw new MissingDependenciesError();
    const { eventEmitter } = dependencies;

    this.eventEmitter = eventEmitter;
    this.logger = MikroLog.start();

    this.analyticsBusName = process.env.ANALYTICS_BUS_NAME || '';
    this.domainBusName = process.env.DOMAIN_BUS_NAME || '';

    if (!this.analyticsBusName || !this.domainBusName)
      throw new MissingEnvVarsError(
        JSON.stringify([
          { key: 'DOMAIN_BUS_NAME', value: process.env.DOMAIN_BUS_NAME },
          { key: 'ANALYTICS_BUS_NAME', value: process.env.ANALYTICS_BUS_NAME }
        ])
      );
  }

  /**
   * @description Convenience method to emit an event
   * to the domain bus and to the analytics bus.
   */
  public async publish(event: Event): Promise<void> {
    const source = event.get().Source;

    await this.eventEmitter.emit(event.get());
    this.logger.log(`Emitted '${source}' to '${this.domainBusName}'`);

    await this.eventEmitter.emit(event.getAnalyticsVariant(this.analyticsBusName));
    this.logger.log(`Emitted '${source}' to '${this.analyticsBusName}'`);
  }
}
