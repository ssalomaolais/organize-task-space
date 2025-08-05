import { ResponseUtil } from "../utils/responseUtil.js";
import { Stack } from "../services/stack.js";
import { parse } from "../utils/parseUtil.js";

const stackService = new Stack();

export const createStackController = async (event) => {
    console.log('Received event (POST /stacks):', JSON.stringify(event, null, 2));

    const resultMethod = ResponseUtil.checkMethod(event,"POST",true);

    if (resultMethod.statusCode != 200){
        return resultMethod;
    }
    
    try {
        const body = await parse(event);
        const result = await stackService.create(body);
        return ResponseUtil.createResponse(201, result?.message, result?.data);
    }
    catch (err) {
        console.error('Error creating stack:', err);
        return ResponseUtil.createResponse(500, "Failed to create stack", err.message);
    }
};