import { Context, APIGatewayProxyResult } from 'aws-lambda';
import { MikroLog } from 'mikrolog';

import { OpenSlotUseCase } from '../../../application/usecases/OpenSlotUseCase';

import { MissingSlotId } from '../../../errors/MissingSlotId';
import { UnsupportedVersionError } from '../../../errors/UnsupportedVersionError';

import { setupDependencies } from '../../utils/setupDependencies';
import { getSlotId } from '../../utils/getSlotId';
import { getVersion } from '../../utils/getVersion';
import { setCorrelationId } from '../../utils/userMetadata';

import { metadataConfig } from '../../../config/metadata';

/**
 * @description Open up a Slot again.
 */
export async function handler(
  event: Record<string, any>,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    MikroLog.start({ metadataConfig: { ...metadataConfig, service: 'OpenSlot' }, event, context });
    if (getVersion(event) !== 1) throw new UnsupportedVersionError();

    const slotId = getSlotId(event);
    if (!slotId) throw new MissingSlotId();

    setCorrelationId(event, context);

    const dependencies = setupDependencies(metadataConfig('OpenSlot'));

    await OpenSlotUseCase(dependencies, slotId);

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
