import { ObjectDynamoDB } from "../database/ObjectDynamoDB.js";
import { v4 as uuidv4 } from 'uuid';

export class Task {
  constructor() {
    this.objectDynamoDB = new ObjectDynamoDB();
    this.tableName = "tasks";  
  }

  async create(body) {
    try {
      const taskData = body;
      const now = new Date().toISOString();
      const newTask = {
        id: uuidv4(),
        ...taskData,
        created_at: now,
        updated_at: now,
      };

      const params = {
        TableName: this.tableName,
        Item: newTask,
      };

      await this.objectDynamoDB.putObject(params);
      return { message: "Tarefa criada com sucesso", data: newTask };
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
      return { message: "Tarefas carregadas com sucesso", data: dbResult.data };
    } catch (err) {
      throw err;
    }
  }

  async update(id, updateData) {
    try {
      const now = new Date().toISOString();
      let UpdateExpression = 'set updated_at = :updatedAt';
      let ExpressionAttributeValues = { ':updatedAt': now };
      let ExpressionAttributeNames = {};

      for (const key in updateData) {
          if (updateData.hasOwnProperty(key) && key !== 'id' && key !== 'created_at') {
              UpdateExpression += `, #${key} = :${key}`;
              ExpressionAttributeValues[`:${key}`] = updateData[key];
              ExpressionAttributeNames[`#${key}`] = key;
          }
      }

      const params = {
          TableName: this.tableName,
          Key: { id: id },
          UpdateExpression: UpdateExpression,
          ExpressionAttributeValues: ExpressionAttributeValues,
          ExpressionAttributeNames: Object.keys(ExpressionAttributeNames).length > 0 ? ExpressionAttributeNames : undefined,
          ReturnValues: 'ALL_NEW'
      };

      const dbResult = await this.objectDynamoDB.updateObject(params);
      return { message: "Tarefa atualizada com sucesso", data: dbResult.data };
    } catch (err) {
      throw err;
    }
  }

  async delete(taskId) {
    try {
      const params = {
        TableName: this.tableName,
        Key: { id: taskId },
      };

      await this.objectDynamoDB.deleteObject(params);
      return { message: "Tarefa removida com sucesso" };
    } catch (err) {
      throw err;
    }
  }
}