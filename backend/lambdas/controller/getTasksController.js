import { ResponseUtil } from "../utils/responseUtil";
import { Task } from "../services/task";

const taskService = new Task();

export const getTasksController = async (event) => {
    console.log('Received event (GET /tasks):', JSON.stringify(event, null, 2));

    if (event.httpMethod !== "GET") {
        return ResponseUtil.createResponse(405, "Method Not Allowed", "Only GET method is allowed.");
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