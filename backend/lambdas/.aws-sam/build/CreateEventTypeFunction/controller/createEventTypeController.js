import { ResponseUtil } from "../utils/responseUtil";
import { EventType } from "../service/eventType";
const eventType = new EventType();
export const createEventTypeController = async (event) => {
    console.log('Received event (POST /event-types):', JSON.stringify(event, null, 2));

    if (event.httpMethod !== "POST") {
        throw new Error("Only accpets POST method.");
    }
    if (!event.body) {
        throw new Error("Event body as required.");
    }
    try {
        const body = await parse(event);
        const result = await eventType.create(body);
        return ResponseUtil.createResponse(201, result?.message, result?.data);
    }
    catch (err) {
        console.error('Error creating event type:', err);
        return ResponseUtil.createResponse(500, "Failed to create event type", err.message);
    }
};
