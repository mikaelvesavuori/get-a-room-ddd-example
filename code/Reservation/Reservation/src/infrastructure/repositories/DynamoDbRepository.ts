import { randomUUID } from 'crypto';
import {
  AttributeValue,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  QueryCommandOutput
} from '@aws-sdk/client-dynamodb';

import { Repository } from '../../interfaces/Repository';
import { SlotDTO, SlotId } from '../../interfaces/Slot';
import { DynamoItem, DynamoItems } from '../../interfaces/DynamoDb';
import { Event, EventDetail } from '../../interfaces/Event';

import { MissingEnvVarsError } from '../../errors/MissingEnvVarsError';

import { getCleanedItems } from '../utils/getCleanedItems';

import testData from '../../../testdata/dynamodb/testData.json';

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
   * @description Create and return expiration time for database item.
   */
  private getExpiryTime(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return Date.parse(tomorrow.toString()).toString().substring(0, 10);
  }

  /**
   * @description Load a Slot from the source database.
   */
  public async loadSlot(slotId: SlotId): Promise<SlotDTO> {
    const command = {
      TableName: this.tableName,
      KeyConditionExpression: 'itemType = :itemType AND id = :id',
      ExpressionAttributeValues: {
        ':itemType': { S: 'SLOT' },
        ':id': { S: slotId }
      },
      ProjectionExpression: 'id, hostName, timeSlot, slotStatus, createdAt, updatedAt'
    };

    const data: QueryCommandOutput | DynamoItems =
      process.env.NODE_ENV === 'test'
        ? testData
        : await this.docClient.send(new QueryCommand(command));
    const items =
      (data.Items?.map((item: Record<string, AttributeValue>) => item) as DynamoItem[]) || [];

    return getCleanedItems(items)[0] as unknown as SlotDTO;
  }

  /**
   * @description Load all Slots for the day from the source database.
   */
  public async loadSlots(): Promise<SlotDTO[]> {
    const command = {
      TableName: this.tableName,
      KeyConditionExpression: 'itemType = :itemType',
      ExpressionAttributeValues: {
        ':itemType': { S: 'SLOT' }
      },
      ProjectionExpression: 'id, hostName, timeSlot, slotStatus, createdAt, updatedAt'
    };

    const data: QueryCommandOutput | DynamoItems =
      process.env.NODE_ENV === 'test'
        ? testData
        : await this.docClient.send(new QueryCommand(command));
    const items =
      (data.Items?.map((item: Record<string, AttributeValue>) => item) as DynamoItem[]) || [];

    return getCleanedItems(items);
  }

  /**
   * @description Add (create/update) a slot in the source database.
   */
  public async updateSlot(slot: SlotDTO): Promise<void> {
    const { slotId, hostName, timeSlot, slotStatus, createdAt, updatedAt } = slot;

    const expiresAt = this.getExpiryTime();
    const command = {
      TableName: this.tableName,
      Item: {
        itemType: { S: 'SLOT' },
        id: { S: slotId },
        hostName: { S: hostName || '' },
        timeSlot: { S: JSON.stringify(timeSlot) },
        slotStatus: { S: slotStatus },
        createdAt: { S: createdAt },
        updatedAt: { S: updatedAt },
        expiresAt: { N: expiresAt }
      }
    };

    if (process.env.NODE_ENV !== 'test') await this.docClient.send(new PutItemCommand(command));
  }

  /**
   * @description Add (append) an Event in the source database.
   */
  public async addEvent(event: Event): Promise<void> {
    const eventData = event.get();
    const detail: EventDetail = JSON.parse(eventData['Detail']);
    const data = typeof detail['data'] === 'string' ? JSON.parse(detail['data']) : detail['data'];

    const command = {
      TableName: this.tableName,
      Item: {
        itemType: { S: 'EVENT' },
        id: { S: randomUUID() },
        eventTime: { S: detail['metadata']['timestamp'] },
        eventType: { S: data['event'] },
        event: { S: JSON.stringify(eventData) }
      }
    };

    if (process.env.NODE_ENV !== 'test') await this.docClient.send(new PutItemCommand(command));
  }
}
