import { ObjectDynamoDB } from "../database/ObjectDynamoDB";

export class EventType {
  constructor() {
    this.objectDynamoDB = new ObjectDynamoDB();
    this.tableName = "event_type";  
  }

  async create(body) {
    try {
      const eventTypeData = body;
      const now = new Date().toISOString();
      const newEventType = {
        ...eventTypeData,
        created_at: now,
        updated_at: now,
      };

      const params = {
        TableName: this.tableName,
        Item: newEventType,
      };

      await this.objectDynamoDB.putObject(params);
      return { message: "Tipo de evento criado com sucesso", data: newEventType };
    } catch (err) {
      throw err;
    }
  }

  async get() {
    try {
      const params = {
        TableName: this.tableName
      };

      const dbResult = await this.objectDynamoDB.getObjects(params);
      return { message: "Tipos de evento carregados com sucesso", data: dbResult.data };
    } catch (err) {
      throw err;
    }
  }

  async update(value, updateData) {
    try {
      const now = new Date().toISOString();
      let UpdateExpression = 'set updated_at = :updatedAt';
      let ExpressionAttributeValues = { ':updatedAt': now };
      let ExpressionAttributeNames = {};

      for (const key in updateData) {
          if (updateData.hasOwnProperty(key) && key !== 'value' && key !== 'created_at') {
              UpdateExpression += `, #${key} = :${key}`;
              ExpressionAttributeValues[`:${key}`] = updateData[key];
              ExpressionAttributeNames[`#${key}`] = key;
          }
      }

      const params = {
          TableName: this.tableName,
          Key: { value: value },
          UpdateExpression: UpdateExpression,
          ExpressionAttributeValues: ExpressionAttributeValues,
          ExpressionAttributeNames: Object.keys(ExpressionAttributeNames).length > 0 ? ExpressionAttributeNames : undefined,
          ReturnValues: 'ALL_NEW'
      };

      const dbResult = await this.objectDynamoDB.updateObject(params);
      return { message: "Tipo de evento atualizado com sucesso", data: dbResult.data };
    } catch (err) {
      throw err;
    }
  }

  async delete(eventTypeValue) {
    try {
      const params = {
        TableName: this.tableName,
        Key: { value: eventTypeValue },
      };

      await this.objectDynamoDB.deleteObject(params);
      return { message: "Tipo de evento removido com sucesso" };
    } catch (err) {
      throw err;
    }
  }
}