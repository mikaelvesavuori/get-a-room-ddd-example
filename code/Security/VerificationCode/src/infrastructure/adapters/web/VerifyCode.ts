import { APIGatewayProxyResult, Context } from 'aws-lambda';
import { MikroLog } from 'mikrolog';

import { VerifyCodeUseCase } from '../../../application/usecases/VerifyCodeUseCase';

import { MissingRequiredFieldsError } from '../../../errors/MissingRequiredFieldsError';
import { UnsupportedVersionError } from '../../../errors/UnsupportedVersionError';

import { setupDependencies } from '../../utils/setupDependencies';
import { getDTO } from '../../utils/getDTO';
import { getVersion } from '../../utils/getVersion';

import { metadataConfig } from '../../../config/metadata';

/**
 * @description Verify a room code.
 */
export async function handler(
  event: Record<string, any>,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    MikroLog.start({
      metadataConfig: { ...metadataConfig, service: 'VerifyCode' },
      event,
      context
    });
    if (getVersion(event) !== 1) throw new UnsupportedVersionError();

    const data = getDTO(event);
    if (!data || !data?.slotId || !data?.verificationCode) throw new MissingRequiredFieldsError();

    const { repository } = setupDependencies();

    const verification = await VerifyCodeUseCase(repository, data);

    return {
      statusCode: 200,
      body: JSON.stringify(verification)
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.message)
    };
  }
}
