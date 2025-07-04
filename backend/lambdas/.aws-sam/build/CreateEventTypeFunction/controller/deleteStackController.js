import { ResponseUtil } from "../utils/responseUtil";
import { Stack } from "../services/stack";

const stackService = new Stack();

export const deleteStackController = async (event) => {
    console.log('Received event (DELETE /stacks/{value}):', JSON.stringify(event, null, 2));

    if (event.httpMethod !== "DELETE") {
        return ResponseUtil.createResponse(405, "Method Not Allowed", "Only DELETE method is allowed.");
    }
    if (!event.pathParameters || !event.pathParameters.value) {
        return ResponseUtil.createResponse(400, "Bad Request", "Stack value is required.");
    }
    try {
        const stackValue = event.pathParameters.value;
        await stackService.delete(stackValue);
        return ResponseUtil.createResponse(204, "Comunidade removida com sucesso");
    }
    catch (err) {
        console.error('Error deleting stack:', err);
        return ResponseUtil.createResponse(500, "Failed to delete stack", err.message);
    }
};