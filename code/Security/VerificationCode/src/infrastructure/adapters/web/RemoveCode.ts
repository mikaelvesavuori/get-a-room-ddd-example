import { APIGatewayProxyResult, Context } from 'aws-lambda';
import { MikroLog } from 'mikrolog';

import { RemoveCodeUseCase } from '../../../application/usecases/RemoveCodeUseCase';

import { MissingRequiredFieldsError } from '../../../errors/MissingRequiredFieldsError';
import { UnsupportedVersionError } from '../../../errors/UnsupportedVersionError';

import { setupDependencies } from '../../utils/setupDependencies';
import { getDTO } from '../../utils/getDTO';
import { getVersion } from '../../utils/getVersion';

import { metadataConfig } from '../../../config/metadata';

/**
 * @description Remove a room code.
 */
export async function handler(
  event: Record<string, any>,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    MikroLog.start({
      metadataConfig: { ...metadataConfig, service: 'RemoveCode' },
      event,
      context
    });
    if (getVersion(event) !== 1) throw new UnsupportedVersionError();

    const data = getDTO(event);
    if (!data || !data?.slotId) throw new MissingRequiredFieldsError();

    const { repository } = setupDependencies();

    await RemoveCodeUseCase(repository, data);

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
