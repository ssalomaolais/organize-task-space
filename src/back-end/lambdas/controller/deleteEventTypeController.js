import { ResponseUtil } from "../utils/responseUtil.js";
import { EventType } from "../services/eventType.js";

const eventTypeService = new EventType();

export const deleteEventTypeController = async (event) => {
    console.log('Received event (DELETE /event-types/{value}):', JSON.stringify(event, null, 2));

    const resultMethod = ResponseUtil.checkMethod(event,"DELETE",false);

    if (resultMethod.statusCode != 200){
        return resultMethod;
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