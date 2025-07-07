import { useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { Task, ListValue } from "@/types/task";
import { User } from "@/types/auth";
import { ResizeConfirmationModal } from "./ResizeConfirmationModal";
import { EventContent } from "./EventContent";
import { useCalendarUtils } from "@/hooks/useCalendarUtils";
import "@/CalendarView.css";

interface CalendarViewProps {
  user: User;
  tasks: Task[];
  stack: ListValue[];
  eventType: ListValue[];
  onUpdateTask: (taskData: Omit<Task, "id" | "created_at" | "updated_at">) => Promise<{ success: boolean; error?: string }>;
  onDeleteTask: (taskId: string) => void;
  setEditingTask: (task: Task) => void;
}

interface ResizeConfirmation {
  task: Task;
  newStart: Date;
  newEnd: Date;
  info: any;
  originalStart: Date;
  originalEnd: Date;
}

export const CalendarView = ({ tasks, user, stack, eventType, onUpdateTask, onDeleteTask, setEditingTask }: CalendarViewProps) => {
  const [resizeConfirmation, setResizeConfirmation] = useState<ResizeConfirmation | null>(null);
  const [isResizeModalOpen, setIsResizeModalOpen] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0); // Key para forçar re-render do FullCalendar

  const {
    getEventTypeColor,
    formatDateTime,
    calculateDuration,
    validateMinimumDuration,
    formatDateForStorage,
    convertUTCToLocal
  } = useCalendarUtils(eventType);

    const createEventsFromTask = (task: Task) => {
    const colors = getEventTypeColor(task.event_type);
    const startDate = convertUTCToLocal(task.start_date);
    const endDate = convertUTCToLocal(task.end_date || task.start_date);
    
    // Se o evento é no mesmo dia, retorna um evento normal
    if (startDate.toDateString() === endDate.toDateString()) {
      return [{
        id: task.id,
        title: task.title,
        start: startDate,
        end: endDate,
        allDay: false,
        extendedProps: {
          task: task,
          eventType: task.event_type,
          responsible: task.responsible,
          description: task.description,
          isRecurring: false,
        },
        backgroundColor: colors.bg,
        borderColor: colors.text,
        textColor: colors.text,
      }];
    }
    
    // Se o evento se estende por múltiplos dias, criar eventos recorrentes
    const events = [];
    const currentDate = new Date(startDate);
    const endOfDay = new Date(endDate);
    
    while (currentDate <= endOfDay) {
      // Verificar se é fim de semana (0 = domingo, 6 = sábado)
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Pular fins de semana para eventos recorrentes
      if (isWeekend) {
        // Avançar para o próximo dia
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
      
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      
      // Para o primeiro dia, usar o horário de início original
      if (currentDate.toDateString() === startDate.toDateString()) {
        dayStart.setHours(startDate.getHours(), startDate.getMinutes(), 0, 0);
        // Se o evento termina no mesmo dia, usar o horário de fim original
        if (endDate.toDateString() === startDate.toDateString()) {
          dayEnd.setHours(endDate.getHours(), endDate.getMinutes(), 0, 0);
        } else {
          // Se continua para outros dias, terminar no final do dia atual
          dayEnd.setHours(23, 59, 59, 999);
        }
      }
      // Para o último dia, usar o horário de fim original
      else if (currentDate.toDateString() === endDate.toDateString()) {
        // Começar no início do dia
        dayStart.setHours(0, 0, 0, 0);
        dayEnd.setHours(endDate.getHours(), endDate.getMinutes(), 0, 0);
      }
      // Para dias intermediários, usar horários fixos baseados no evento original
      else {
        // Usar os horários originais do evento
        dayStart.setHours(startDate.getHours(), startDate.getMinutes(), 0, 0);
        dayEnd.setHours(endDate.getHours(), endDate.getMinutes(), 0, 0);
      }
      
      events.push({
        id: `${task.id}-${currentDate.toISOString().split('T')[0]}`,
        title: task.title,
        start: dayStart,
        end: dayEnd,
        allDay: false,
        extendedProps: {
          task: task,
          eventType: task.event_type,
          responsible: task.responsible,
          description: task.description,
          isRecurring: true,
          originalTaskId: task.id,
          dayIndex: events.length,
        },
        backgroundColor: colors.bg,
        borderColor: colors.text,
        textColor: colors.text,
      });
      
      // Avançar para o próximo dia
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return events;
  };

  const events = tasks.flatMap(createEventsFromTask);

  // Verificar se há eventos nos fins de semana
  const hasWeekendEvents = events.some(event => {
    const startDate = event.start;
    const endDate = event.end;
    
    // Verificar se o evento se estende por sábado (6) ou domingo (0)
    const startDay = startDate.getDay();
    const endDay = endDate.getDay();
    
    // Se o evento começa ou termina no fim de semana, ou se se estende por múltiplos dias incluindo fim de semana
    return startDay === 0 || startDay === 6 || endDay === 0 || endDay === 6 || 
           (startDate.getTime() !== endDate.getTime() && 
            (startDay <= 6 && endDay >= 0 || startDay >= 0 && endDay <= 6));
  });

  // Configurar dias da semana baseado na presença de eventos no fim de semana
  const businessDays = hasWeekendEvents ? [0, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5];

  const handleEventClick = useCallback((info: any) => {
    const task = info.event.extendedProps.task;
    const isRecurring = info.event.extendedProps.isRecurring;
    
    // Para eventos recorrentes, sempre usar a tarefa original
    const taskToEdit = isRecurring ? task : task;
    
    setEditingTask(taskToEdit); // Definir editingTask no Dashboard
  }, [setEditingTask]);

  const handleEventDrop = useCallback(async (info: any) => {
    const task = info.event.extendedProps.task;
    const isRecurring = info.event.extendedProps.isRecurring;
    const startDate = info.event.start;
    const endDate = info.event.end || startDate;

    // Para eventos recorrentes, calcular a nova duração baseada no deslocamento
    let newStartDate = startDate;
    let newEndDate = endDate;
    
    if (isRecurring) {
      const originalStart = convertUTCToLocal(task.start_date);
      const originalEnd = convertUTCToLocal(task.end_date || task.start_date);
      const duration = originalEnd.getTime() - originalStart.getTime();
      
      // Manter a duração original, apenas deslocar no tempo
      newEndDate = new Date(startDate.getTime() + duration);
    }

    const updatedTaskData: Omit<Task, "id" | "created_at" | "updated_at"> = {
      ...task,
      start_date: formatDateForStorage(newStartDate),
      end_date: formatDateForStorage(newEndDate),
    };

    const result = await onUpdateTask(updatedTaskData);
    if (!result?.success) {
      info.revert();
    }
  }, [onUpdateTask, convertUTCToLocal, formatDateForStorage]);

  const handleEventResizeStop = useCallback((info: any) => {
    const task = info.event.extendedProps.task;
    const isRecurring = info.event.extendedProps.isRecurring;
    const newStart = info.event.start;
    const newEnd = info.event.end;

    // Para eventos recorrentes, não permitir redimensionamento individual
    if (isRecurring) {
      info.revert();
      return;
    }

    // Validar duração mínima
    if (!validateMinimumDuration(newStart, newEnd)) {
      info.revert();
      return;
    }

    // Mostrar modal de confirmação
    setResizeConfirmation({
      task,
      newStart,
      newEnd,
      info,
      originalStart: convertUTCToLocal(task.start_date),
      originalEnd: convertUTCToLocal(task.end_date || task.start_date)
    });
    setIsResizeModalOpen(true);
  }, [validateMinimumDuration, convertUTCToLocal]);

  const handleResizeConfirm = useCallback(async () => {
    if (!resizeConfirmation) return;

    const { task, newStart, newEnd, info } = resizeConfirmation;

    const updatedTaskData: Omit<Task, "id" | "created_at" | "updated_at"> = {
      ...task,
      start_date: formatDateForStorage(newStart),
      end_date: formatDateForStorage(newEnd),
    };

    const result = await onUpdateTask(updatedTaskData);
    if (!result?.success) {
      info.revert();
    }

    setIsResizeModalOpen(false);
    setResizeConfirmation(null);
  }, [resizeConfirmation, onUpdateTask]);

  const handleResizeCancel = useCallback(() => {
    if (resizeConfirmation && resizeConfirmation.info) {
      // Tentar reverter a mudança no evento
      try {
        if (resizeConfirmation.info.event && typeof resizeConfirmation.info.event.setStart === 'function') {
          // Restaurar as datas originais
          resizeConfirmation.info.event.setStart(resizeConfirmation.originalStart);
          resizeConfirmation.info.event.setEnd(resizeConfirmation.originalEnd);
        }
      } catch (error) {
        console.warn('Erro ao reverter redimensionamento:', error);
      }
    }
    // Fechar o modal e limpar o estado
    setIsResizeModalOpen(false);
    setResizeConfirmation(null);
  }, [resizeConfirmation]);



  const renderEventContent = (eventInfo: any) => {
    const task = eventInfo.event.extendedProps.task;
    const isRecurring = eventInfo.event.extendedProps.isRecurring;
    
    // Verificar se task existe antes de acessar suas propriedades
    if (!task) {
      return (
        <div className="event-content">
          <div className="event-title">{eventInfo.event.title}</div>
        </div>
      );
    }
    
    const colors = getEventTypeColor(task.event_type);
    
    // Adicionar indicador visual para eventos recorrentes
    const title = isRecurring ? `🔄 ${eventInfo.event.title}` : eventInfo.event.title;
    
    return (
      <EventContent 
        eventInfo={{
          ...eventInfo,
          event: {
            ...eventInfo.event,
            title: title
          }
        }}
        task={task}
        colors={colors}
        convertUTCToLocal={convertUTCToLocal}
      />
    );
  };

  return (
    <>
      <div className="calendar-container p-4">
        <FullCalendar
          key={calendarKey}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          initialView="dayGridMonth"
          locale={ptBrLocale}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={hasWeekendEvents}
          events={events}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResizeStop={handleEventResizeStop}
          eventContent={renderEventContent}
          eventDidMount={(info) => {
            // Aplicar cores quando o evento é montado
            const task = info.event.extendedProps.task;
            if (task) {
              const colors = getEventTypeColor(task.event_type);
              info.el.style.backgroundColor = colors.bg;
              info.el.style.borderColor = colors.text;
              info.el.style.color = colors.text;
            }
          }}
          height="auto"
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          slotDuration="00:30:00"
          snapDuration="00:15:00"
          selectConstraint="businessHours"
          timeZone="local"
          nowIndicator={true}
          now={new Date()}
          businessHours={{
            daysOfWeek: businessDays,
            startTime: '08:00',
            endTime: '18:00',
          }}
          buttonText={{
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            list: 'Lista'
          }}
          dayHeaderFormat={{ 
            weekday: 'long',
            day: 'numeric'
          }}
          titleFormat={{ 
            year: 'numeric', 
            month: 'long',
            day: 'numeric'
          }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
          }}
          eventResizableFromStart={true}
          eventMinHeight={20}
          eventMinWidth={50}
          dayCellContent={(arg) => {
            return (
              <div className="fc-daygrid-day-number">
                {arg.dayNumberText}
              </div>
            );
          }}
        />
      </div>
      


      <ResizeConfirmationModal
        isOpen={isResizeModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Se o modal está sendo fechado, apenas fechar sem executar handleResizeCancel
            // pois isso pode causar dupla execução quando o botão Cancelar é clicado
            setIsResizeModalOpen(false);
            setResizeConfirmation(null);
          }
        }}
        resizeConfirmation={resizeConfirmation}
        onConfirm={handleResizeConfirm}
        onCancel={handleResizeCancel}
        formatDateTime={formatDateTime}
        calculateDuration={calculateDuration}
        convertUTCToLocal={convertUTCToLocal}
      />
    </>
  );
};

export default CalendarView;
