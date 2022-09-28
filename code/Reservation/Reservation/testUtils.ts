export const setEnv = () => {
  process.env.ANALYTICS_BUS_NAME = 'AnalyticsBusTest';
  process.env.DOMAIN_BUS_NAME = 'DomainBusTest';
};

export const cleanEnv = () => {
  process.env.ANALYTICS_BUS_NAME = '';
  process.env.DOMAIN_BUS_NAME = '';
};

/**
 * @description Pull out event data, validate presence of fields
 * and then return adjusted non-volatile Data Transfer Objects
 * to use for equality testing.
 */
export function getValidated(t: any, event: any, expected: any, getAnalyticsVariant = false) {
  const response: any = getAnalyticsVariant
    ? event.getAnalyticsVariant('AnalyticsBusTest')
    : event.get();
  response['Detail'] = JSON.parse(response['Detail']);

  // Check presence of dynamic fields
  t.true(response['Detail']['metadata']['timestamp'] !== null);
  t.true(response['Detail']['metadata']['timestampEpoch'] !== null);
  t.true(response['Detail']['metadata']['id'] !== null);

  // Drop dynamic fields for test validation
  delete response['Detail']['metadata']['timestamp'];
  delete response['Detail']['metadata']['timestampEpoch'];
  delete response['Detail']['metadata']['id'];
  delete expected['Detail']['metadata']['timestamp'];
  delete expected['Detail']['metadata']['timestampEpoch'];
  delete expected['Detail']['metadata']['id'];

  return { response, expected };
}
