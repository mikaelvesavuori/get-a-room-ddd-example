/**
 * @description Set current correlation ID in process environment for portability.
 */
export function setCorrelationId(event: Record<string, any>, context: Record<string, any>): void {
  const correlationId =
    event?.detail?.metadata?.correlationId || context?.awsRequestId || 'UNKNOWN';
  process.env.CORRELATION_ID = correlationId;
}

/**
 * @description Get correlation ID from process environment.
 */
export function getCorrelationId(): string {
  return process.env.CORRELATION_ID || 'UNKNOWN';
}
