import { InputDto } from '../../interfaces/InputDto';

/**
 * @description Utility function to get data transfer object from request payload.
 */
export function getDTO(event: Record<string, any>): InputDto | void {
  if (!event) return;

  // Match for EventBridge case, `RemoveCode`
  if (event?.detail)
    return {
      slotId: event?.detail?.data?.slotId || '',
      verificationCode: event?.detail?.data?.code || ''
    };

  // Match for typical API GW input
  const body: Record<string, string> =
    event.body && typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  if (body)
    return {
      slotId: body.slotId || '',
      verificationCode: body.code || ''
    };
  else return;
}
