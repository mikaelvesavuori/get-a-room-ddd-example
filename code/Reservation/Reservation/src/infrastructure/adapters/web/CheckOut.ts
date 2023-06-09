import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { MikroLog } from 'mikrolog';

import { CheckOutUseCase } from '../../../application/usecases/CheckOutUseCase';

import { MissingRequestBodyError } from '../../../errors/MissingRequestBodyError';
import { UnsupportedVersionError } from '../../../errors/UnsupportedVersionError';

import { setupDependencies } from '../../utils/setupDependencies';
import { getVersion } from '../../utils/getVersion';
import { setCorrelationId } from '../../utils/userMetadata';

import { metadataConfig } from '../../../config/metadata';

/**
 * @description Check out of slot.
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    MikroLog.start({ metadataConfig: { ...metadataConfig, service: 'CheckOut' }, event, context });
    if (getVersion(event) !== 1) throw new UnsupportedVersionError();

    const body: Record<string, string | number> =
      typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    if (!body || JSON.stringify(body) === '{}') throw new MissingRequestBodyError();
    const slotId = body.id as string;

    setCorrelationId(event, context);

    const dependencies = setupDependencies(metadataConfig('CheckOut'));

    await CheckOutUseCase(dependencies, slotId);

    return {
      statusCode: 204,
      body: ''
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.message)
    };
  }
}
