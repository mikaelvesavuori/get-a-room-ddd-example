import { APIGatewayProxyResult, APIGatewayEvent, Context } from 'aws-lambda';
import { MikroLog } from 'mikrolog';

import { GenerateCodeUseCase } from '../../../application/usecases/GenerateCodeUseCase';

import { MissingRequiredFieldsError } from '../../../errors/MissingRequiredFieldsError';
import { UnsupportedVersionError } from '../../../errors/UnsupportedVersionError';

import { setupDependencies } from '../../utils/setupDependencies';
import { getDTO } from '../../utils/getDTO';
import { getVersion } from '../../utils/getVersion';

import { metadataConfig } from '../../../config/metadata';

/**
 * @description Generate a room code.
 */
export async function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    MikroLog.start({
      metadataConfig: { ...metadataConfig, service: 'GenerateCode' },
      event,
      context
    });
    if (getVersion(event) !== 1) throw new UnsupportedVersionError();

    const data = getDTO(event);
    if (!data || !data?.slotId) throw new MissingRequiredFieldsError();

    const { repository } = setupDependencies();

    const generatedCode = await GenerateCodeUseCase(repository, data);

    return {
      statusCode: 200,
      body: JSON.stringify(generatedCode)
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.message)
    };
  }
}
