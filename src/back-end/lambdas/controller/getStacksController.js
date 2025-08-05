import { ResponseUtil } from "../utils/responseUtil.js";
import { Stack } from "../services/stack.js";

const stackService = new Stack();

export const getStacksController = async (event) => {
    console.log('Received event (GET /stacks):', JSON.stringify(event, null, 2));

    const resultMethod = ResponseUtil.checkMethod(event,"GET",false);

    if (resultMethod.statusCode != 200){
        return resultMethod;
    }
    
    try {
        const result = await stackService.get();
        return ResponseUtil.createResponse(200, result?.message, result?.data);
    }
    catch (err) {
        console.error('Error getting stacks:', err);
        return ResponseUtil.createResponse(500, "Failed to get stacks", err.message);
    }
};