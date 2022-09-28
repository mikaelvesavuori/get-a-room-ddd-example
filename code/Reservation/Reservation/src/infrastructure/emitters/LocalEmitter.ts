import { EventEmitter } from '../../interfaces/EventEmitter';
import { EventBridgeEvent } from '../../interfaces/Event';

/**
 * @description Factory function to return freshly minted local emitter instance.
 */
export const createLocalEmitter = () => new LocalEmitter();

/**
 * @description The `LocalEmitter` is a simple fake to approximate actual EventBridge usage.
 */
class LocalEmitter implements EventEmitter {
  /**
   * @description Utility to emit fake local events.
   */
  public async emit(event: EventBridgeEvent): Promise<void> {
    console.log(`Emitting event: ${JSON.stringify(event)}`);
  }
}
