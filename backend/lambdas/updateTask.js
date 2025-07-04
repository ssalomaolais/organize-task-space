const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Received event (PUT /tasks/{id}):', JSON.stringify(event, null, 2));
    const taskId = event.pathParameters.id;
    try {
        const updateData = JSON.parse(event.body);
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
            TableName: 'tasks',
            Key: { id: taskId },
            UpdateExpression: UpdateExpression,
            ExpressionAttributeValues: ExpressionAttributeValues,
            ExpressionAttributeNames: Object.keys(ExpressionAttributeNames).length > 0 ? ExpressionAttributeNames : undefined,
            ReturnValues: 'ALL_NEW'
        };

        const result = await dynamodb.update(params).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
            },
            body: JSON.stringify(result.Attributes)
        };
    } catch (error) {
        console.error('Error updating task:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
            },
            body: JSON.stringify({ message: 'Failed to update task', error: error.message })
        };
    }
};