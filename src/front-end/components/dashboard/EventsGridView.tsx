// src/components/dashboard/EventsGridView.tsx

import { Task } from "@/types/task";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type PaletteType = "minsait" | "indra";

interface EventsGridViewProps {
  filteredTasks: Task[];
  palette: PaletteType;
  setEditingTask: (task: Task) => void;
}

export const EventsGridView = ({
  filteredTasks,
  palette,
  setEditingTask,
}: EventsGridViewProps) => {

  const palettes = {
    minsait: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      pageBackground: '#f0f0f0',
      schemes: {
        dark: { cardBackground: '#4f062a', titleText: '#e4023f', dateText: '#ffffff', descriptionText: '#ffffff', participantText: '#ffffff' },
        light: { cardBackground: '#ffffff', titleText: '#63284b', dateText: '#6b7280', descriptionText: '#ff3d88', participantText: '#63284b' }
      }
    },
    indra: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      pageBackground: '#EBEAE6',
      schemes: {
        dark: { cardBackground: '#00434F', titleText: '#FFFFFF', dateText: '#FFFFFF', descriptionText: '#FFFFFF', participantText: '#FFFFFF' },
        light: { cardBackground: '#ADD8E6', titleText: '#000000', dateText: '#000000', descriptionText: '#000000', participantText: '#000000' }
      }
    }
  };

  const currentPalette = palettes[palette];
  const numberOfColumns = 6;

  if (filteredTasks.length === 0) {
    return (
      <div style={{ backgroundColor: currentPalette.pageBackground, fontFamily: currentPalette.fontFamily }} className="text-center p-8 min-h-screen">
        <p className="text-lg text-gray-600">Nenhum evento encontrado.</p>
        <p className="text-sm text-gray-500">Tente ajustar os filtros.</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: currentPalette.pageBackground, fontFamily: currentPalette.fontFamily }} className="p-4 md:p-8 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredTasks.map((task, index) => {
          const row = Math.floor(index / numberOfColumns);
          const currentScheme = (palette === 'minsait' && (row + index) % 2 !== 0) 
            ? currentPalette.schemes.light 
            : currentPalette.schemes.dark;

          const indraScheme = (palette === 'indra' && (row + index) % 2 !== 0)
            ? palettes.indra.schemes.light
            : palettes.indra.schemes.dark;

          const cardStyle = palette === 'indra' ? indraScheme : currentScheme;

          return (
            <div
              key={task.id}
              style={{
                backgroundColor: cardStyle.cardBackground,
                clipPath: 'polygon(5% 0, 95% 0, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0 95%, 0 5%)',
                minHeight: '260px'
              }}
              className="flex flex-col shadow-lg p-4"
            >
              <div className="flex-grow text-left cursor-pointer" onClick={() => setEditingTask(task)}>
                  <p style={{ color: cardStyle.dateText }} className="font-semibold text-sm mb-1">
                      {format(new Date(task.start_date), "dd/MM HH'h'", { locale: ptBR })}
                  </p>
                  <h3 style={{ color: cardStyle.titleText }} className="text-base font-bold">
                      {task.title}
                  </h3>
              </div>

              <div className="flex justify-between items-end">
                <p style={{ color: cardStyle.descriptionText }} className="text-xs leading-snug w-2/3 text-left">
                    {task.summary ? task.summary : task.description}
                </p>
                <div
                  style={{ color: cardStyle.participantText }}
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

export default EventsGridView;
