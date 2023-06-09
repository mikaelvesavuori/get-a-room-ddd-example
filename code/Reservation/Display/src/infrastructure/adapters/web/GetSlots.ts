import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { MikroLog } from 'mikrolog';

import { GetSlotsUseCase } from '../../../application/usecases/GetSlotsUseCase';

import { UnsupportedVersionError } from '../../../errors/UnsupportedVersionError';

import { setupDependencies } from '../../utils/setupDependencies';
import { getVersion } from '../../utils/getVersion';

import { metadataConfig } from '../../../config/metadata';

/**
 * @description Returns daily slots.
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    MikroLog.start({ metadataConfig: { ...metadataConfig, service: 'GetSlots' }, event, context });
    if (getVersion(event) !== 1) throw new UnsupportedVersionError();

    const dependencies = setupDependencies();

    const slots = await GetSlotsUseCase(dependencies);

    return {
      statusCode: 200,
      body: JSON.stringify(slots)
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.message)
    };
  }
}
