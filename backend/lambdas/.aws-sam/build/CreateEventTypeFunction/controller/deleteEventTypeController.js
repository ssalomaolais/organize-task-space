import { ResponseUtil } from "../utils/responseUtil";
import { EventType } from "../services/eventType";

const eventTypeService = new EventType();

export const deleteEventTypeController = async (event) => {
    console.log('Received event (DELETE /event-types/{value}):', JSON.stringify(event, null, 2));

    if (event.httpMethod !== "DELETE") {
        return ResponseUtil.createResponse(405, "Method Not Allowed", "Only DELETE method is allowed.");
    }
    if (!event.pathParameters || !event.pathParameters.value) {
        return ResponseUtil.createResponse(400, "Bad Request", "Event type value is required.");
    }
    try {
        const eventTypeValue = event.pathParameters.value;
        await eventTypeService.delete(eventTypeValue);
        return ResponseUtil.createResponse(204, "Tipo de evento removido com sucesso");
    }
    catch (err) {
        console.error('Error deleting event type:', err);
        return ResponseUtil.createResponse(500, "Failed to delete event type", err.message);
    }
};