import { Task, ListValue } from "@/types/task";
import { User } from "@/types/auth";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import TaskForm from "../task/TaskForm";

interface EditTaskModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: Task | null;
  user: User;
  stack: ListValue[];
  eventType: ListValue[];
  onSubmit: (taskData: Omit<Task, "id" | "created_at" | "updated_at">) => Promise<void>;
  onDelete: (taskId: string) => void;
  onCancel: () => void;
}

export const EditTaskModal = ({
  isOpen,
  onOpenChange,
  selectedTask,
  user,
  stack,
  eventType,
  onSubmit,
  onDelete,
  onCancel
}: EditTaskModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogTitle>Editar Tarefa</DialogTitle>
        <DialogDescription>
          Modifique os detalhes da tarefa selecionada. Todos os campos obrigatórios devem ser preenchidos.
        </DialogDescription>
        {selectedTask && (
          <TaskForm
            task={selectedTask}
            user={user}
            stack={stack}
            eventType={eventType}
            onSubmit={onSubmit}
            onDelete={onDelete}
            onCancel={onCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}; 