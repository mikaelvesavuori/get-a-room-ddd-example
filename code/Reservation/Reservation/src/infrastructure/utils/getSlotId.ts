/**
 * @description Utility function to get slot ID from either event or request payload.
 */
export function getSlotId(event: Record<string, any>) {
  if (!event) return;

  if (event?.detail?.slotId) return event.detail.slotId;

  const body: Record<string, string | number> =
    event.body && typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  if (body.slotId) return body.slotId;
  else return;
}
