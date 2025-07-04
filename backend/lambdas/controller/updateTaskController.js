import { ResponseUtil } from "../utils/responseUtil";
import { Task } from "../services/task";
import { parse } from "../utils/parseUtil";

const taskService = new Task();

export const updateTaskController = async (event) => {
    console.log('Received event (PUT /tasks/{id}):', JSON.stringify(event, null, 2));

    if (event.httpMethod !== "PUT") {
        return ResponseUtil.createResponse(405, "Method Not Allowed", "Only PUT method is allowed.");
    }
    if (!event.pathParameters || !event.pathParameters.id) {
        return ResponseUtil.createResponse(400, "Bad Request", "Task ID is required.");
    }
    if (!event.body) {
        return ResponseUtil.createResponse(400, "Bad Request", "Event body is required.");
    }
    try {
        const taskId = event.pathParameters.id;
        const body = await parse(event);
        const result = await taskService.update(taskId, body);
        return ResponseUtil.createResponse(200, result?.message, result?.data);
    }
    catch (err) {
        console.error('Error updating task:', err);
        return ResponseUtil.createResponse(500, "Failed to update task", err.message);
    }
};