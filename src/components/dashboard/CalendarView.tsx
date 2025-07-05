import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Task, ListValue } from "@/types/task";
import { User } from "@/types/auth";
import { Dialog, DialogContent } from "../ui/dialog";
import TaskForm from "./TaskForm";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/CalendarView.css";

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
  onUpdateTask: (taskData: Omit<Task, "id" | "created_at" | "updated_at">) => void;
  onDeleteTask: (taskId: string) => void;
}

export const CalendarView = ({ tasks, user, stack, eventType, onUpdateTask, onDeleteTask }: CalendarViewProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const events = tasks.map((task) => ({
    id: task.id,
    title: (
      <div className="event-title">
        <span
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTask(task);
            setIsEditModalOpen(true);
          }}
        >
          {task.title}
        </span>
      </div>
    ),
    start: new Date(task.start_date),
    end: new Date(task.end_date || task.start_date),
    allDay: false,
    resource: task.event_type,
  }));

  const handleUpdateAndClose = (updatedTaskData: Omit<Task, "id" | "created_at" | "updated_at">) => {
    onUpdateTask(updatedTaskData);
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };
  
  const handleDeleteAndClose = (taskId: string) => {
    onDeleteTask(taskId);
    setIsEditModalOpen(false);
    setSelectedTask(null);
  }

  const eventStyleGetter = (event: any) => {
    const backgroundColor = {
      "Forum Técnico": "#007bff",
      "Meetup Interno": "#28a745",
      "Meetup Externo": "#17a2b8",
      "Techup Interno": "#ffc107",
      "Techup Externo": "#dc3545",
      "Outros": "#6c757d",
    }[event.resource] || "#6c757d";

    return {
      style: { backgroundColor, borderColor: backgroundColor },
    };
  };

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
            event: (props) => <div>{props.title}</div>,
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
