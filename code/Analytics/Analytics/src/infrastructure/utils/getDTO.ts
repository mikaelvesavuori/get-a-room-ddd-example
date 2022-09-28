import { AnalyticalRecord } from '../../interfaces/AnalyticalRecord';

/**
 * @description Utility function to get data transfer object from either event or request payload.
 */
export function getDTO(event: Record<string, any>): AnalyticalRecord | void {
  if (!event) return;

  // Match for EventBridge case
  if (event?.detail) return createEventBridgeDto(event);

  // Match for typical API GW input
  const body: Record<string, string | number> =
    event.body && typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  if (body) return createApiGatewayDto(body);
  else return;
}

function createEventBridgeDto(event: any) {
  return {
    id: event?.detail?.metadata?.id || '',
    correlationId: event?.detail?.metadata?.correlationId || '',
    event: event?.detail?.data?.event || '',
    slotId: event?.detail?.data?.slotId || '',
    startsAt: event?.detail?.data?.startTime || '',
    hostName: event?.detail?.data?.hostName || ''
  };
}

function createApiGatewayDto(body: any) {
  return {
    id: body.id || '',
    correlationId: body.correlationId || '',
    event: body.event || '',
    slotId: body.slotId || '',
    startsAt: body.startTime || '',
    hostName: body.hostName || ''
  };
}
