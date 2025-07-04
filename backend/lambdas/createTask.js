const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    console.log('Received event (POST /tasks):', JSON.stringify(event, null, 2));
    try {
        const taskData = JSON.parse(event.body);
        const now = new Date().toISOString();
        const newTask = {
            id: uuidv4(),
            ...taskData,
            created_at: now,
            updated_at: now
        };

        const params = {
            TableName: 'tasks',
            Item: newTask
        };

        await dynamodb.put(params).promise();

        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
            },
            body: JSON.stringify(newTask)
        };
    } catch (error) {
        console.error('Error creating task:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
            },
            body: JSON.stringify({ message: 'Failed to create task', error: error.message })
        };
    }
};