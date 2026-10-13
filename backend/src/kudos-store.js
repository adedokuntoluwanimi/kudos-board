import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

export function createKudosStore(tableName, client = DynamoDBDocumentClient.from(new DynamoDBClient({}))) {
  return {
    async create(kudos) {
      await client.send(new PutCommand({ TableName: tableName, Item: kudos }));
      return kudos;
    },

    async listRecent() {
      const items = [];
      let exclusiveStartKey;
      do {
        const page = await client.send(new ScanCommand({
          TableName: tableName,
          ExclusiveStartKey: exclusiveStartKey
        }));
        items.push(...(page.Items ?? []));
        exclusiveStartKey = page.LastEvaluatedKey;
      } while (exclusiveStartKey);

      return items
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp) || b.id.localeCompare(a.id))
        .slice(0, 50);
    }
  };
}
