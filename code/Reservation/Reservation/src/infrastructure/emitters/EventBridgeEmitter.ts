import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

import { EventBridgeEvent } from '../../interfaces/Event';
import { EventEmitter } from '../../interfaces/EventEmitter';

import { MissingEnvVarsError } from '../../errors/MissingEnvVarsError';

/**
 * @description Factory function to return freshly minted EventBridge instance.
 */
export const createEventBridgeEmitter = (region: string) => {
  if (!region) throw new MissingEnvVarsError(JSON.stringify([{ key: 'REGION', value: region }]));

  return new EventBridgeEmitter(region);
};

/**
 * @description An EventBridge implementation of the `EventEmitter`.
 */
class EventBridgeEmitter implements EventEmitter {
  private readonly eventBridge: EventBridgeClient;

  constructor(region: string) {
    this.eventBridge = new EventBridgeClient({ region });
  }

  /**
   * @description Utility to emit events with the AWS EventBridge library.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html
   * @see https://www.npmjs.com/package/@aws-sdk/client-eventbridge
   */
  public async emit(event: EventBridgeEvent): Promise<void> {
    const command = new PutEventsCommand({ Entries: [event] });
    if (process.env.NODE_ENV !== 'test') await this.eventBridge.send(command);
  }
}
