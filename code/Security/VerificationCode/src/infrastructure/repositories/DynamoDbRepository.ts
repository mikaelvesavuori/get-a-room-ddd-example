import {
  DynamoDBClient,
  PutItemCommand,
  DeleteItemCommand,
  QueryCommand
} from '@aws-sdk/client-dynamodb';

import { Repository } from '../../interfaces/Repository';

import { MissingEnvVarsError } from '../../errors/MissingEnvVarsError';
import { SlotId } from '../../interfaces/SlotId';
import { GeneratedVerificationCode } from '../../interfaces/GeneratedVerificationCode';

/**
 * @description Factory function to create a DynamoDB repository.
 */
export function createDynamoDbRepository() {
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
   * @description Get verification code from source system.
   */
  public async getCode(slotId: SlotId): Promise<GeneratedVerificationCode> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': { S: slotId }
      },
      ProjectionExpression: 'code'
    };

    const data =
      process.env.NODE_ENV !== 'test'
        ? await this.docClient.send(new QueryCommand(params))
        : { Items: [{ code: { S: 'fake-verification-code' } }] };

    const { code } = this.getCleanedItem(data.Items as DynamoItem[]);
    return code;
  }

  /**
   * @description Add (create/update) a verification code to the source database.
   */
  public async addCode(verificationCode: GeneratedVerificationCode, slotId: SlotId): Promise<void> {
    const expiresAt = this.getExpiryTime();
    const command = {
      TableName: this.tableName,
      Item: {
        id: { S: `${slotId}` },
        code: { S: `${verificationCode}` },
        expiresAt: { N: expiresAt }
      }
    };

    if (process.env.NODE_ENV !== 'test') await this.docClient.send(new PutItemCommand(command));
  }

  /**
   * @description Remove a verification code from the source database.
   */
  public async removeCode(slotId: SlotId): Promise<void> {
    const command = {
      TableName: this.tableName,
      Key: {
        id: { S: slotId }
      }
    };

    if (process.env.NODE_ENV !== 'test') await this.docClient.send(new DeleteItemCommand(command));
  }

  /**
   * @description Clean up and return (first) item in a normalized format.
   */
  private getCleanedItem(items: DynamoItem[]) {
    return {
      code: items[0]?.['code']?.['S']
    };
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

/**
 * @description Record in the database.
 */
type DynamoItem = {
  [key: string]: StringRepresentation;
};

/**
 * @description String that represents the value.
 */
type StringRepresentation = {
  S: string;
};
