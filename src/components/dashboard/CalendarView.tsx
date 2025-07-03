import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { Edit } from "lucide-react";
import { useState } from "react";
import { ptBR } from "date-fns/locale/pt-BR";
import { Task } from "@/types/task";
import { Dialog, DialogContent } from "../ui/dialog";
import TaskForm from "./TaskForm";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/CalendarView.css";
import { User } from "@/types/auth";

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
  onUpdateTask: (task: Task) => void;
}

export const CalendarView = ({ tasks, user, onUpdateTask }: CalendarViewProps) => {
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
          }
        }>{task.title}</span>
      </div>
    ),
    start: new Date(task.start_date),
    end: new Date(task.end_date || task.start_date),
    allDay: false,
    resource: task.event_type,
  }));

  const handleUpdateTask = (updatedTask: Task) => {
    onUpdateTask(updatedTask);
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const eventStyleGetter = (event: any) => {
    const backgroundColor =
      {
        meeting: "#007bff",
        task: "#28a745",
        appointment: "#dc3545",
      }[event.resource] || "#6c757d";

    return {
      style: { backgroundColor },
    };
  };

  return (
    <>
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          views={["month", "week"]}
          defaultView="week"
          messages={{
            week: "Semana",
            month: "Mês",
            today: "Hoje",
            next: "Próximo",
            previous: "Anterior",
          }}
          min={new Date(new Date().setHours(7, 0, 0))}
          max={new Date(new Date().setHours(19, 0, 0))}
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
              onSubmit={handleUpdateTask}
              onCancel={() => {
                setIsEditModalOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarView;
