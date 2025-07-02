// src/components/dashboard/EventsGridView.tsx

import { Task } from "@/types/task";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EventsGridViewProps {
  filteredTasks: Task[];
}

export const EventsGridView = ({ filteredTasks }: EventsGridViewProps) => {
  const styles = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    pageBackground: '#f0f0f0',
    schemes: {
      dark: {
        cardBackground: '#4f062a',
        titleText: '#e4023f',
        dateText: '#ffffff',
        descriptionText: '#ffffff',
        participantText: '#ffffff'
      },
      light: {
        cardBackground: '#ffffff',
        titleText: '#63284b',
        dateText: '#6b7280',
        descriptionText: '#ff3d88',
        participantText: '#63284b'
      }
    }
  };

  if (filteredTasks.length === 0) {
    return (
      <div style={{ backgroundColor: styles.pageBackground, fontFamily: styles.fontFamily }} className="text-center p-8 min-h-screen">
        <p className="text-lg text-gray-600">Nenhum evento encontrado.</p>
        <p className="text-sm text-gray-500">Tente ajustar os filtros.</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: styles.pageBackground, fontFamily: styles.fontFamily }} className="p-4 md:p-8 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"> 
    
        {filteredTasks.map((task, index) => {
         
          const currentScheme = index % 2 === 0 ? styles.schemes.dark : styles.schemes.light;

          return (
            <div
              key={task.id}
              style={{
                backgroundColor: currentScheme.cardBackground,
                clipPath: 'polygon(5% 0, 95% 0, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0 95%, 0 5%)',
                minHeight: '260px' 
              }}
              className="flex flex-col shadow-lg p-4" 
            >
             
              <div className="flex-grow text-left">
                  <p style={{ color: currentScheme.dateText }} className="font-semibold text-sm mb-1">
                      {format(new Date(task.start_date), "dd/MM HH'h'", { locale: ptBR })}
                  </p>
                  <h3 style={{ color: currentScheme.titleText }} className="text-base font-bold">
                      {task.title}
                  </h3>
              </div>

            
              <div className="flex justify-between items-end">
  
                <p style={{ color: currentScheme.descriptionText }} className="text-xs leading-snug w-2/3 text-left">
                    {task.description}
                </p>

             
                <div
                  style={{ color: currentScheme.participantText }}
                  className="flex flex-col items-end text-right"
                >
                  <span className="font-bold text-xl">{task.people || 0}</span>
                  <span className="text-xs">Participantes</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
