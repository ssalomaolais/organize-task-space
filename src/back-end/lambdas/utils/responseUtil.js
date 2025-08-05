export class ResponseUtil {
    static createResponse(statusCode, message = "", data = null) {
        return {
            statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
            },
            body: JSON.stringify({ message, data }),
        };
    }

    static checkMethod (event, type, body) {
        if (event.httpMethod !== type) {
            return ResponseUtil.createResponse(405, "Method Not Allowed", `Only accpets ${type} method is allowed.`);
        }
        if (body && !event.body) {
            return ResponseUtil.createResponse(400, "Bad Request", "Event body is required.");
        }

        return {statusCode:200};
    }
}
