import { ResponseUtil } from "../utils/responseUtil.js";
import { EventType } from "../services/eventType.js";

const eventType = new EventType();
export const createEventTypeController = async (event) => {
    console.log('Received event (POST /event-types):', JSON.stringify(event, null, 2));

    const resultMethod = ResponseUtil.checkMethod(event,"POST",true);

    if (resultMethod.statusCode != 200){
        return resultMethod;
    }

    try {
        const body = JSON.parse(event.body); // Use JSON.parse directly as parseUtil is not imported here
        const result = await eventType.create(body);
        return ResponseUtil.createResponse(201, result?.message, result?.data);
    }
    catch (err) {
        console.error('Error creating event type:', err);
        return ResponseUtil.createResponse(500, "Failed to create event type", err.message);
    }
};