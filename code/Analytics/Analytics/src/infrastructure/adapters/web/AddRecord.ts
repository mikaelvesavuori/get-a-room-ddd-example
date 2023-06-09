import { Context } from 'aws-lambda';
import { MikroLog } from 'mikrolog';

import { AddRecordUseCase } from '../../../application/usecases/AddRecordUseCase';

import { MissingDataFieldsError } from '../../../errors/MissingDataFieldsError';

import { setupDependencies } from '../../utils/setupDependencies';
import { getDTO } from '../../utils/getDTO';

import { metadataConfig } from '../../../config/metadata';

/**
 * @description Add an analytical record.
 */
export async function handler(event: Record<string, any>, context: Context): Promise<any> {
  try {
    MikroLog.start({ metadataConfig: { ...metadataConfig, service: 'AddRecord' }, event, context });
    const data = getDTO(event);
    if (!data) throw new MissingDataFieldsError();

    const dependencies = setupDependencies();

    await AddRecordUseCase(dependencies, data);

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
