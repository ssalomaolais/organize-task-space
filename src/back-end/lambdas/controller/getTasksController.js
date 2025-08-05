import { ResponseUtil } from "../utils/responseUtil.js";
import { Task } from "../services/task.js";

const taskService = new Task();

export const getTasksController = async (event) => {
    console.log('Received event (GET /tasks):', JSON.stringify(event, null, 2));

    const resultMethod = ResponseUtil.checkMethod(event,"GET",false);

    if (resultMethod.statusCode != 200){
        return resultMethod;
    }
    
    try {
        const result = await taskService.get();
        return ResponseUtil.createResponse(200, result?.message, result?.data);
    }
    catch (err) {
        console.error('Error getting tasks:', err);
        return ResponseUtil.createResponse(500, "Failed to get tasks", err.message);
    }
};