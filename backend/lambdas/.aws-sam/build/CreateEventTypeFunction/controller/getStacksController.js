import { ResponseUtil } from "../utils/responseUtil";
import { Stack } from "../services/stack";

const stackService = new Stack();

export const getStacksController = async (event) => {
    console.log('Received event (GET /stacks):', JSON.stringify(event, null, 2));

    if (event.httpMethod !== "GET") {
        return ResponseUtil.createResponse(405, "Method Not Allowed", "Only GET method is allowed.");
    }
    try {
        const result = await stackService.get();
        return ResponseUtil.createResponse(200, result?.message, result?.data);
    }
    catch (err) {
        console.error('Error getting stacks:', err);
        return ResponseUtil.createResponse(500, "Failed to get stacks", err.message);
    }
};