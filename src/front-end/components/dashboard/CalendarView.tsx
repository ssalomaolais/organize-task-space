import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Task, ListValue } from "@/types/task";
import { User } from "@/types/auth";
import { Dialog, DialogContent } from "../ui/dialog";
import TaskForm from "../task/TaskForm";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/CalendarView.css";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarViewProps {
  user: User;
  tasks: Task[];
  stack: ListValue[];
  eventType: ListValue[];
  onUpdateTask: (taskData: Omit<Task, "id" | "created_at" | "updated_at">) => Promise<{ success: boolean; error?: string }>;
  onDeleteTask: (taskId: string) => void;
}

export const CalendarView = ({ tasks, user, stack, eventType, onUpdateTask, onDeleteTask }: CalendarViewProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getEventTypeColor = (eventTypeValue: string) => {
    return eventType.find((et) => et.value === eventTypeValue)?.color || "#6c757d";
  };

  const eventStyleGetter = (event: any) => {
    const colorClass = getEventTypeColor(event.resource.event_type);
    return {
      className: colorClass,
    };
  };

  const events = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: new Date(task.start_date),
    end: new Date(task.end_date || task.start_date),
    allDay: false,
    resource: task,
  }));

  const handleUpdateAndClose = async (updatedTaskData: Omit<Task, "id" | "created_at" | "updated_at">) => {
    // onUpdateTask agora retorna um resultado
    const result = await onUpdateTask(updatedTaskData);
    if (result?.success) {
      // Só fechamos o modal se a operação foi bem-sucedida
      setIsEditModalOpen(false);
      setSelectedTask(null);
    }
    // Se não foi bem-sucedido, o modal permanece aberto
  };
  
  const handleDeleteAndClose = (taskId: string) => {
    onDeleteTask(taskId);
    setIsEditModalOpen(false);
    setSelectedTask(null);
  }

  return (
    <>
      <div className="calendar-container p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          views={["month", "week", "day"]}
          defaultView="month"
          messages={{
            week: "Semana",
            month: "Mês",
            day: "Dia",
            today: "Hoje",
            next: "Próximo",
            previous: "Anterior",
            agenda: "Agenda"
          }}
          min={new Date(new Date().setHours(7, 0, 0))}
          max={new Date(new Date().setHours(20, 0, 0))}
          eventPropGetter={eventStyleGetter}
          components={{
            event: (props) => {
              const task = props.event.resource;
              return (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="event-title">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                            setIsEditModalOpen(true);
                          }}
                        >
                          {props.title}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className={`max-w-xs break-words whitespace-pre-line max-h-48 overflow-y-auto ${getEventTypeColor(task.event_type)}`} style={{ color: '#222' }}>
                      <div className="space-y-1">
                        <div className="font-bold text-base">{task.title}</div>
                        <div className="text-base">Responsável: {task.responsible}</div>
                        <div><strong>Início:</strong> {new Date(task.start_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                        <div><strong>Fim:</strong> {task.end_date ? new Date(task.end_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '-'}</div>
                        <div className="text-xs mt-1">{task.description}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            },
          }}
        />
      </div>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl">
          {selectedTask && (
            <TaskForm
              task={selectedTask}
              user={user}
              stack={stack}
              eventType={eventType}
              onSubmit={handleUpdateAndClose}
              onDelete={handleDeleteAndClose}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedTask(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarView;
