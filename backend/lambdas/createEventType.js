const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Received event (POST /event-types):', JSON.stringify(event, null, 2));
    try {
        const eventTypeData = JSON.parse(event.body);
        const now = new Date().toISOString();
        const newEventType = {
            ...eventTypeData,
            created_at: now,
            updated_at: now
        };

        const params = {
            TableName: 'event_type',
            Item: newEventType
        };

        await dynamodb.put(params).promise();

        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
            },
            body: JSON.stringify(newEventType)
        };
    } catch (error) {
        console.error('Error creating event type:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
            },
            body: JSON.stringify({ message: 'Failed to create event type', error: error.message })
        };
    }
};