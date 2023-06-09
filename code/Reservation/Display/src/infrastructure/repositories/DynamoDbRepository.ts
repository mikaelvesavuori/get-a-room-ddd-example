import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { MissingEnvVarsError } from '../../errors/MissingEnvVarsError';

import { DynamoItem } from '../../interfaces/DynamoDb';
import { Repository } from '../../interfaces/Repository';
import { Slot } from '../../interfaces/Slot';

import { getCleanedItems } from '../utils/getCleanedItems';

import testTimes from '../../../testdata/testTimesDb.json';

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
   * @description Add (create/update) a time slot in the database.
   */
  public async add(slot: Slot): Promise<void> {
    const { slotId, slotStatus, startsAt, hostName } = slot;

    const expiresAt = this.getExpiryTime();
    const command = {
      TableName: this.tableName,
      Item: {
        itemType: { S: 'SLOT' }, // HASH
        slotId: { S: slotId }, // RANGE
        slotStatus: { S: slotStatus },
        hostName: { S: hostName },
        startsAt: { S: startsAt },
        expiresAt: { N: expiresAt }
      }
    };

    if (process.env.NODE_ENV !== 'test') await this.docClient.send(new PutItemCommand(command));
  }

  /**
   * @description Load all Slots for the day from the source database.
   */
  public async getSlots(): Promise<Slot[]> {
    const command = {
      TableName: this.tableName,
      KeyConditionExpression: 'itemType = :itemType',
      ExpressionAttributeValues: {
        ':itemType': { S: 'SLOT' }
      },
      ProjectionExpression: 'slotId, hostName, slotStatus, startsAt'
    };

    const data =
      process.env.NODE_ENV === 'test'
        ? testTimes
        : await this.docClient.send(new QueryCommand(command));

    return getCleanedItems(data.Items as DynamoItem[]);
  }

  /**
   * @description Create and return expiration time for database item.
   */
  private getExpiryTime(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return Date.parse(tomorrow.toString()).toString().substring(0, 10);
  }
}
