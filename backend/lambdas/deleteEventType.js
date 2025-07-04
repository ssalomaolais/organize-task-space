const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Received event (DELETE /event-types/{value}):', JSON.stringify(event, null, 2));
    const eventTypeValue = event.pathParameters.value;

    const params = {
        TableName: 'event_type',
        Key: { value: eventTypeValue }
    };

    try {
        await dynamodb.delete(params).promise();
        return {
            statusCode: 204, // No Content
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
            },
            body: ''
        };
    } catch (error) {
        console.error('Error deleting event type:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
            },
            body: JSON.stringify({ message: 'Failed to delete event type', error: error.message })
        };
    }
};