import { ResponseUtil } from "../utils/responseUtil";
import { Stack } from "../services/stack";
import { parse } from "../utils/parseUtil";

const stackService = new Stack();

export const createStackController = async (event) => {
    console.log('Received event (POST /stacks):', JSON.stringify(event, null, 2));

    if (event.httpMethod !== "POST") {
        return ResponseUtil.createResponse(405, "Method Not Allowed", "Only POST method is allowed.");
    }
    if (!event.body) {
        return ResponseUtil.createResponse(400, "Bad Request", "Event body is required.");
    }
    try {
        const body = await parse(event);
        const result = await stackService.create(body);
        return ResponseUtil.createResponse(201, result?.message, result?.data);
    }
    catch (err) {
        console.error('Error creating stack:', err);
        return ResponseUtil.createResponse(500, "Failed to create stack", err.message);
    }
};