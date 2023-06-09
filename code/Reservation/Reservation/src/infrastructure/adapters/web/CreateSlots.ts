import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { MikroLog } from 'mikrolog';

import { CreateSlotsUseCase } from '../../../application/usecases/CreateSlotsUseCase';

import { UnsupportedVersionError } from '../../../errors/UnsupportedVersionError';

import { setupDependencies } from '../../utils/setupDependencies';
import { getVersion } from '../../utils/getVersion';
import { setCorrelationId } from '../../utils/userMetadata';

import { metadataConfig } from '../../../config/metadata';

/**
 * @description Create fresh daily Slots.
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    MikroLog.start({
      metadataConfig: { ...metadataConfig, service: 'CreateSlots' },
      event,
      context
    });
    if (getVersion(event) !== 1) throw new UnsupportedVersionError();

    setCorrelationId(event, context);

    const dependencies = setupDependencies(metadataConfig('CreateSlots'));

    const slotIds = await CreateSlotsUseCase(dependencies);

    return {
      statusCode: 200,
      body: JSON.stringify(slotIds)
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.message)
    };
  }
}
