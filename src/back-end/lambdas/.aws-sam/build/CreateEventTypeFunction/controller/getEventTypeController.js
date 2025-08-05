import { ResponseUtil } from "../utils/responseUtil.js";
import { EventType } from "../services/eventType.js";

const eventTypeService = new EventType();

export const getEventTypeController = async (event) => {
    console.log('Received event (GET /event-types):', JSON.stringify(event, null, 2));

    if (event.httpMethod !== "GET") {
        return ResponseUtil.createResponse(405, "Method Not Allowed", "Only GET method is allowed.");
    }
    try {
        const result = await eventTypeService.get();
        return ResponseUtil.createResponse(200, result?.message, result?.data);
    }
    catch (err) {
        console.error('Error getting event types:', err);
        return ResponseUtil.createResponse(500, "Failed to get event types", err.message);
    }
};