import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

import { Repository } from '../../interfaces/Repository';
import { AnalyticalRecord } from '../../interfaces/AnalyticalRecord';

import { MissingEnvVarsError } from '../../errors/MissingEnvVarsError';
import { FailureToAddError } from '../../errors/FailureToAddError';

/**
 * @description Factory function to create a DynamoDB repository.
 */
export function createDynamoDbRepository(): DynamoDbRepository {
  return new DynamoDbRepository();
}

/**
 * @description Concrete implementation of DynamoDB repository.
 * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html
 */
class DynamoDbRepository implements Repository {
  docClient: DynamoDBClient;
  tableName: string;
  region: string;

  constructor() {
    this.region = process.env.REGION || '';
    this.tableName = process.env.TABLE_NAME || '';

    if (!this.region || !this.tableName)
      throw new MissingEnvVarsError(
        JSON.stringify([
          { key: 'REGION', value: process.env.REGION },
          { key: 'TABLE_NAME', value: process.env.TABLE_NAME }
        ])
      );

    this.docClient = new DynamoDBClient({ region: this.region });
  }

  /**
   * @description Add (create/update) a Record to the Analytics database.
   */
  public async add(record: AnalyticalRecord): Promise<void> {
    if (
      !record.id ||
      !record.correlationId ||
      !record.event ||
      !record.slotId ||
      !record.startsAt ||
      !record.hostName
    )
      throw new FailureToAddError('Missing required inputs when adding record!');
    const { id, correlationId, event, slotId, startsAt, hostName } = record;
    const command = {
      TableName: this.tableName,
      Item: {
        event: { S: event }, // HASH
        id: { S: id }, // RANGE
        correlationId: { S: correlationId },
        slotId: { S: slotId },
        hostName: { S: hostName },
        startsAt: { S: startsAt }
      }
    };

    if (process.env.NODE_ENV === 'test') return;
    await this.docClient.send(new PutItemCommand(command));
  }
}
