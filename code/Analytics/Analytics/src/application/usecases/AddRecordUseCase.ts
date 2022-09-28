import { Record } from '../../domain/entities/Record';

import { Dependencies } from '../../interfaces/Dependencies';
import { AnalyticalRecord } from '../../interfaces/AnalyticalRecord';

/**
 * @description Add record to database.
 */
export async function AddRecordUseCase(
  dependencies: Dependencies,
  analyticalRecord: AnalyticalRecord
) {
  const { repository } = dependencies;

  const record = new Record().fromDto(analyticalRecord);

  repository.add(record.toDto());
}
