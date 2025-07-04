import { ResponseUtil } from "../utils/responseUtil";
import { EventType } from "../services/eventType";
import { parse } from "../utils/parseUtil";

const eventTypeService = new EventType();

export const updateEventTypeController = async (event) => {
    console.log('Received event (PUT /event-types/{value}):', JSON.stringify(event, null, 2));

    if (event.httpMethod !== "PUT") {
        return ResponseUtil.createResponse(405, "Method Not Allowed", "Only PUT method is allowed.");
    }
    if (!event.pathParameters || !event.pathParameters.value) {
        return ResponseUtil.createResponse(400, "Bad Request", "Event type value is required.");
    }
    if (!event.body) {
        return ResponseUtil.createResponse(400, "Bad Request", "Event body is required.");
    }
    try {
        const eventTypeValue = event.pathParameters.value;
        const body = await parse(event);
        const result = await eventTypeService.update(eventTypeValue, body);
        return ResponseUtil.createResponse(200, result?.message, result?.data);
    }
    catch (err) {
        console.error('Error updating event type:', err);
        return ResponseUtil.createResponse(500, "Failed to update event type", err.message);
    }
};