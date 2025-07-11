import { Task } from "@/types/task";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EventContentProps {
  eventInfo: any;
  task: Task;
  colors: { bg: string; text: string };
  convertUTCToLocal: (utcDateString: string) => Date;
}

export const EventContent = ({ eventInfo, task, colors, convertUTCToLocal }: EventContentProps) => {
  // Aplicar cores diretamente no elemento do evento
  const eventElement = eventInfo.el;
  if (eventElement) {
    eventElement.style.backgroundColor = colors.bg;
    eventElement.style.borderColor = colors.text;
    eventElement.style.color = colors.text;
  }
  
  // Determinar a posição do tooltip baseada no horário do evento
  const eventStartHour = convertUTCToLocal(task.start_date).getHours();
  // Para eventos da manhã (antes das 11h), tooltip para baixo
  // Para eventos depois das 11h, tooltip para cima
  const tooltipSide: "bottom" | "top" = eventStartHour < 11 ? "bottom" : "top";
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="event-content">
            <div className="event-title">{eventInfo.event.title}</div>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side={tooltipSide}
          align="start"
          sideOffset={5}
          collisionPadding={10}
          className="max-w-xs break-words whitespace-pre-line max-h-48 overflow-y-auto z-[9999]" 
          style={{ 
            color: colors.text,
            backgroundColor: colors.bg,
            borderColor: colors.text
          }}
        >
          <div className="space-y-1">
            <div className="font-bold text-base">{task.title}</div>
            <div><strong>Responsável:</strong> {task.responsible}</div>
            <div><strong>Início:</strong> {convertUTCToLocal(task.start_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
            <div><strong>Fim:</strong> {task.end_date ? convertUTCToLocal(task.end_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '-'}</div>
            <div className="text-xs mt-1">{task.description}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}; 