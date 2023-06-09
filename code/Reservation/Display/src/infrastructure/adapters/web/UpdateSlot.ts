import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { MikroLog } from 'mikrolog';

import { UpdateSlotUseCase } from '../../../application/usecases/UpdateSlotUseCase';

import { MissingDataFieldsError } from '../../../errors/MissingDataFieldsError';
import { UnsupportedVersionError } from '../../../errors/UnsupportedVersionError';

import { setupDependencies } from '../../utils/setupDependencies';
import { getDTO } from '../../utils/getDTO';
import { getVersion } from '../../utils/getVersion';

import { metadataConfig } from '../../../config/metadata';

/**
 * @description Update slot representation.
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    MikroLog.start({
      metadataConfig: { ...metadataConfig, service: 'UpdateSlot' },
      event,
      context
    });
    if (getVersion(event) !== 1) throw new UnsupportedVersionError();

    const data = getDTO(event);
    if (!data) throw new MissingDataFieldsError();

    const dependencies = setupDependencies();

    await UpdateSlotUseCase(dependencies, data);

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
