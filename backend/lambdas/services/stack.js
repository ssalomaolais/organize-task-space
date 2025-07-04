import { ObjectDynamoDB } from "../database/ObjectDynamoDB.js";

export class Stack {
  constructor() {
    this.objectDynamoDB = new ObjectDynamoDB();
    this.tableName = "stack";  
  }

  async create(body) {
    try {
      const stackData = body;
      const now = new Date().toISOString();
      const newStack = {
        ...stackData,
        created_at: now,
        updated_at: now,
      };

      const params = {
        TableName: this.tableName,
        Item: newStack,
      };

      await this.objectDynamoDB.putObject(params);
      return { message: "Comunidade criada com sucesso", data: newStack };
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
      return { message: "Comunidades carregadas com sucesso", data: dbResult.data };
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
      return { message: "Comunidade atualizada com sucesso", data: dbResult.data };
    } catch (err) {
      throw err;
    }
  }

  async delete(stackValue) {
    try {
      const params = {
        TableName: this.tableName,
        Key: { value: stackValue },
      };

      await this.objectDynamoDB.deleteObject(params);
      return { message: "Comunidade removida com sucesso" };
    } catch (err) {
      throw err;
    }
  }
}