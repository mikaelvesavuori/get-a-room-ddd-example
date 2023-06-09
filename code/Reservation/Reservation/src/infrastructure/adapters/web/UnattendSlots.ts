import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { MikroLog } from 'mikrolog';

import { UnattendSlotsUseCase } from '../../../application/usecases/UnattendSlotsUseCase';

import { UnsupportedVersionError } from '../../../errors/UnsupportedVersionError';

import { setupDependencies } from '../../utils/setupDependencies';
import { getVersion } from '../../utils/getVersion';
import { setCorrelationId } from '../../utils/userMetadata';

import { metadataConfig } from '../../../config/metadata';

/**
 * @description Verify that Slots are used, else set them as unattended.
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    MikroLog.start({
      metadataConfig: { ...metadataConfig, service: 'UnattendSlots' },
      event,
      context
    });
    if (getVersion(event) !== 1) throw new UnsupportedVersionError();

    setCorrelationId(event, context);

    const dependencies = setupDependencies(metadataConfig('UnattendSlots'));

    await UnattendSlotsUseCase(dependencies);

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
