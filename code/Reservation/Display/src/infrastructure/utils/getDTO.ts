import { Slot } from '../../interfaces/Slot';

/**
 * @description Utility function to get data transfer object from either event or request payload.
 */
export function getDTO(event: Record<string, any>): Slot | void {
  if (!event) return;

  // Match for EventBridge case
  if (event?.detail)
    return {
      event: event?.detail?.data?.event || '',
      slotId: event?.detail?.data?.slotId || '',
      slotStatus: event?.detail?.data?.slotStatus || '',
      startsAt: event?.detail?.data?.startTime || '',
      hostName: event?.detail?.data?.hostName || ''
    };

  // Match for typical API GW input
  const body: Record<string, string> =
    event.body && typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  if (body)
    return {
      event: body.event || '',
      slotId: body.slotId || '',
      slotStatus: body.slotStatus || '',
      startsAt: body.startTime || '',
      hostName: body.hostName || ''
    };
  else return;
}
