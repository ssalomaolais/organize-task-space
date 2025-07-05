import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Task } from "@/types/task";
import { TaskStatusOptions, getStatusColor } from "@/lib/utils";
import { UserRole } from "@/types/auth";
import { Calendar, Clock,  User as UserIcon, AlertCircle, Play, CheckCircle, XCircle } from "lucide-react";
import { useState } from 'react';
import { ListValue } from "@/types/task";

interface TaskCardProps {
  task: Task;
  stack: ListValue[];
  eventType: ListValue[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: string) => void;
  onTypeChange: (taskId: string, type: string) => void;
  userRole: UserRole;
  showContent?: boolean;
}

const TaskCard = ({ task, stack, eventType, onEdit, onDelete, onStatusChange, onTypeChange: onStatusType, userRole, showContent = true }: TaskCardProps) => {
  const [isHovering, setIsHovering] = useState(false);

  const getStackColor = (item: string) => {
    return stack.find((s) => s.value === item)?.color || "bg-gray-100 text-gray-800";
  };
  
  const getEventLabel= (item: string) => {
    return eventType.find((s) => s.value === item)?.label;
  };

  const getEventTypeColor = (item: string) => {
    // Now directly return the stored Tailwind class string
    return eventType.find((s) => s.value === item)?.color || "bg-gray-100 text-gray-800";
  };

  const getResponsibleTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      instructor: "Instrutor",
      responsible_dnw: "DNW",
      responsible_rh: "RH",
      manager: "Gestor",
      coordinator: "Coordenador",
      facilitator: "Facilitador",
      other: "Outro"
    };
    return typeLabels[type] || type;
  };

  const formatDate = (date) => {
    if (!date) return "";

    const dateObj = new Date(date);
    const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(dateObj.getTime() + userTimezoneOffset);

    return adjustedDate.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const getDaysRemaining = () => {
    const endDate = new Date(task.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getText = (value:string, size:number) => {

    if (value.length < size)
      return value;

    return value.slice(0,size) + "...";

  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pendente":
        return <AlertCircle className="w-3 h-4" />;
      case "Em Progresso":
        return <Play className="w-3 h-4" />;
      case "Completo":
        return <CheckCircle className="w-3 h-4" />;
      case "Cancelado":
        return <XCircle className="w-3 h-4" />;
      default:
        return <AlertCircle className="w-3 h-4" />;
    }
  };

  const daysRemaining = getDaysRemaining();

  // Function to generate hover classes that prevent color change
  const getNoHoverColorClasses = (baseClasses: string) => {
    return baseClasses.split(' ').map(cls => `hover:${cls}`).join(' ');
  };

  const stackColorClass = getStackColor(task.stack);
  const stackNoHoverClass = getNoHoverColorClasses(stackColorClass);

  const peopleColorClass = "bg-gray-100 text-gray-800";
  const peopleNoHoverClass = getNoHoverColorClasses(peopleColorClass);

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-1.5 p-1 pb-0 "
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex gap-1 flex-wrap">
              <div id="dvTitle" className="flex items-center p-1 hover:shadow-md transition-shadow cursor-pointer">
                <h4 className="font-medium text-sm leading-tight" onClick={() => onEdit(task)}>{getText(task.title,38)}</h4> 
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              <Badge className={`text-xs ${stackColorClass} ${stackNoHoverClass} cursor-auto`} style={{ borderRadius: "3px" }}>{task.stack}</Badge>
              {task.people > 0 && (
                <Badge className={`text-xs ${peopleColorClass} ${peopleNoHoverClass} cursor-auto`} style={{ borderRadius: "3px" }}>{task.people}</Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Badge className={`text-xs ${getStatusColor(task.status)}`} style={{ borderRadius: "3px", padding:"5px" }}>
                    {getStatusIcon(task.status)}
                  </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {TaskStatusOptions.filter((status) => status.value !== task.status).map((status) => (
                    <DropdownMenuItem key={status.value} onClick={() => onStatusChange(task.id, status.value)}>
                      <span className="text-xs h-6 px-2">{status.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Badge className={`text-xs ${getEventTypeColor(task.event_type)}`} style={{ borderRadius: "3px", padding:"5px" }}>
                    <span className="text-xs  h-4">{getEventLabel(task.event_type)}</span>
                  </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {eventType.map((status) => (
                    <DropdownMenuItem key={status.value} onClick={() => onStatusType(task.id, status.value)}>
                      <span className="text-xs h-6 px-2">{status.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </div>
        </div>
      </CardHeader>

      {showContent && (
        <CardContent className="flex flex-col space-y-1.5 p-3 pt-0">
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <UserIcon className="w-3 h-3" />
              <span>{task.responsible}</span>
            </div>

            {task.responsibles && task.responsibles.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500 font-medium">Responsáveis:</div>
                {task.responsibles.slice(0, 2).map((responsible) => (
                  <div key={responsible.id} className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>{responsible.name}</span>
                    <span className="text-gray-400">({getResponsibleTypeLabel(responsible.type)})</span>
                  </div>
                ))}
                {task.responsibles.length > 2 && (
                  <div className="text-xs text-gray-400">
                    +{task.responsibles.length - 2} mais responsáveis
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>
                {formatDate(task.start_date)} - {formatDate(task.end_date)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>
                {task.hours}h • {task.people} pessoa{task.people > 1 ? "s" : ""}
                {(task.student_count > 0 || task.vacancy_count > 0) && (
                  <span className="ml-2">
                    • {task.student_count > 0 && `${task.student_count} aluno${task.student_count > 1 ? 's' : ''}`}
                    {task.student_count > 0 && task.vacancy_count > 0 && ' • '}
                    {task.vacancy_count > 0 && `${task.vacancy_count} vaga${task.vacancy_count > 1 ? 's' : ''}`}
                  </span>
                )}
              </span>
            </div>

            {task.status !== "Completo" && task.status !== "Cancelado" && (
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="w-3 h-3" />
                <span className={daysRemaining < 0 ? "text-red-600" : daysRemaining <= 3 ? "text-yellow-600" : "text-gray-500"}>
                  {daysRemaining < 0 ? `${Math.abs(daysRemaining)} dias em atraso` : daysRemaining === 0 ? "Vence hoje" : `${daysRemaining} dias restantes`}
                </span>
              </div>
            )}

            {/* Detalhes adicionais */}
            {(task.syllabus || task.seniority) && (
              <div className="space-y-1 pt-1 border-t border-gray-100">
                {task.seniority && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium">Senioridade:</span>
                    <span>{task.seniority}</span>
                  </div>
                )}
                {task.syllabus && (
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Ementa:</span>
                    <p className="mt-1 line-clamp-2">{task.syllabus}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default TaskCard;