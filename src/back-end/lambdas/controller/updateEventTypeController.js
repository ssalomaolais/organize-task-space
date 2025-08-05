import { ResponseUtil } from "../utils/responseUtil.js";
import { EventType } from "../services/eventType.js";
import { parse } from "../utils/parseUtil.js";

const eventTypeService = new EventType();

export const updateEventTypeController = async (event) => {
    console.log('Received event (PUT /event-types/{value}):', JSON.stringify(event, null, 2));

    const resultMethod = ResponseUtil.checkMethod(event,"PUT",false);

    if (resultMethod.statusCode != 200){
        return resultMethod;
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