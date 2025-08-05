import { ResponseUtil } from "../utils/responseUtil.js";
import { Stack } from "../services/stack.js";

const stackService = new Stack();

export const deleteStackController = async (event) => {
    console.log('Received event (DELETE /stacks/{value}):', JSON.stringify(event, null, 2));

    const resultMethod = ResponseUtil.checkMethod(event,"DELETE",false);

    if (resultMethod.statusCode != 200){
        return resultMethod;
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