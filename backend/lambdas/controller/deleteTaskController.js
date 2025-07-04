import { ResponseUtil } from "../utils/responseUtil";
import { Task } from "../services/task";

const taskService = new Task();

export const deleteTaskController = async (event) => {
    console.log('Received event (DELETE /tasks/{id}):', JSON.stringify(event, null, 2));

    if (event.httpMethod !== "DELETE") {
        return ResponseUtil.createResponse(405, "Method Not Allowed", "Only DELETE method is allowed.");
    }
    if (!event.pathParameters || !event.pathParameters.id) {
        return ResponseUtil.createResponse(400, "Bad Request", "Task ID is required.");
    }
    try {
        const taskId = event.pathParameters.id;
        await taskService.delete(taskId);
        return ResponseUtil.createResponse(204, "Tarefa removida com sucesso");
    }
    catch (err) {
        console.error('Error deleting task:', err);
        return ResponseUtil.createResponse(500, "Failed to delete task", err.message);
    }
};