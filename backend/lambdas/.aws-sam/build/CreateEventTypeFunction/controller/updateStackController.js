import { ResponseUtil } from "../utils/responseUtil";
import { Stack } from "../services/stack";
import { parse } from "../utils/parseUtil";

const stackService = new Stack();

export const updateStackController = async (event) => {
    console.log('Received event (PUT /stacks/{value}):', JSON.stringify(event, null, 2));

    if (event.httpMethod !== "PUT") {
        return ResponseUtil.createResponse(405, "Method Not Allowed", "Only PUT method is allowed.");
    }
    if (!event.pathParameters || !event.pathParameters.value) {
        return ResponseUtil.createResponse(400, "Bad Request", "Stack value is required.");
    }
    if (!event.body) {
        return ResponseUtil.createResponse(400, "Bad Request", "Event body is required.");
    }
    try {
        const stackValue = event.pathParameters.value;
        const body = await parse(event);
        const result = await stackService.update(stackValue, body);
        return ResponseUtil.createResponse(200, result?.message, result?.data);
    }
    catch (err) {
        console.error('Error updating stack:', err);
        return ResponseUtil.createResponse(500, "Failed to update stack", err.message);
    }
};