import { ResponseUtil } from "../utils/responseUtil.js";
import { Task } from "../services/task.js";

const taskService = new Task();

export const deleteTaskController = async (event) => {
    console.log('Received event (DELETE /tasks/{id}):', JSON.stringify(event, null, 2));

    const resultMethod = ResponseUtil.checkMethod(event,"DELETE",false);

    if (resultMethod.statusCode != 200){
        return resultMethod;
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