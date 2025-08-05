import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

export class ObjectDynamoDB {
    constructor() {
        let ddbClient = new DynamoDBClient({});
        this.ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
    }

    async putObject(params) {
        try {
            await this.ddbDocClient.send(new PutCommand(params));
            return { message: "Item successfully inserted" };
        }
        catch (err) {
            throw err;
        }
    }

    async updateObject(params) {
        try {
            const result = await this.ddbDocClient.send(new UpdateCommand(params));
            return { message: "Item successfully updated", data: result.Attributes };
        }
        catch (err) {
            throw err;
        }
    }
    
    async deleteObject(params) {
        try {
            await this.ddbDocClient.send(new DeleteCommand(params));
            return { message: "Item successfully deleted" };
        }
        catch (err) {
            throw err;
        }
    }    

    async getObjects(params) {
        try {
            const results = await this.ddbDocClient.send(new ScanCommand(params));
            return { message: "Get Itens Succefull", data: results.Items };
        }
        catch (error) {
            console.error("Error getting items from DynamoDB:", error);
            throw error;
        }
    }
}