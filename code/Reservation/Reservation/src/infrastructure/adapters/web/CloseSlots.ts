import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { MikroLog } from 'mikrolog';

import { CloseSlotsUseCase } from '../../../application/usecases/CloseSlotsUseCase';

import { UnsupportedVersionError } from '../../../errors/UnsupportedVersionError';

import { setupDependencies } from '../../utils/setupDependencies';
import { getVersion } from '../../utils/getVersion';
import { setCorrelationId } from '../../utils/userMetadata';

import { metadataConfig } from '../../../config/metadata';

/**
 * @description Close expired Slots.
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    MikroLog.start({
      metadataConfig: { ...metadataConfig, service: 'CloseSlots' },
      event,
      context
    });
    if (getVersion(event) !== 1) throw new UnsupportedVersionError();

    setCorrelationId(event, context);

    const dependencies = setupDependencies(metadataConfig('CloseSlots'));

    await CloseSlotsUseCase(dependencies);

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
