import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format } from 'date-fns/format'
import { parse } from 'date-fns/parse'
import {startOfWeek} from 'date-fns/startOfWeek'
import {getDay} from 'date-fns/getDay'
import {ptBR} from 'date-fns/locale/pt-BR'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '@/CalendarView.css'

const locales = {
  'pt-BR': ptBR,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export const CalendarView = ({ tasks }) => {
  // Convert tasks to calendar events format
  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: new Date(task.startDateTime),
    end: new Date(task.endDateTime || task.startDateTime),
    allDay: false,
    resource: task.event_type,
  }))

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        views={['month', 'week']}
        defaultView='week'
        messages={{
          week: 'Semana',
          month: 'Mês',
          today: 'Hoje',
          next: 'Próximo',
          previous: 'Anterior'
        }}
        eventPropGetter={(event) => {
          const backgroundColor = {
            meeting: '#007bff',
            task: '#28a745',
            appointment: '#dc3545'
          }[event.resource] || '#6c757d'
          
          return { style: { backgroundColor } }
        }}
      />
    </div>
  )
}

export default CalendarView