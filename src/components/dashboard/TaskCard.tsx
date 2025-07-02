import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Task } from "@/types/task";
import { TaskStatus, getStatusColor } from "@/lib/utils";
import { UserRole } from "@/types/auth";
import { Calendar, Clock, User, Edit, User as UserIcon } from "lucide-react";
import { useState } from 'react';
import { ListValue } from "@/types/task";

interface TaskCardProps {
  task: Task;
  stack: ListValue[] | [];
  eventType: ListValue[] | [];
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
    return eventType.find((s) => s.value === item)?.color || "bg-gray-100 text-gray-800";
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
  const daysRemaining = getDaysRemaining();

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="flex flex-col space-y-1.5 p-2 pb-1 "
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex gap-1 flex-wrap">
              <div id="dvTitle" className="flex items-center p-1">
                <h4 className="font-medium text-sm leading-tight" onClick={() => onEdit(task)}>{getText(task.title,40)}</h4>
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              <Badge className={`text-xs ${getStackColor(task.stack)}`} style={{ borderRadius: "3px" }}>{task.stack}</Badge>
              {task.people > 0 && (
                <Badge className={`text-xs bg-gray-100 text-gray-800`} style={{ borderRadius: "3px" }}>{task.people}</Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Badge className={`text-xs ${getEventTypeColor(task.event_type)}`} style={{ borderRadius: "3px" }}>
                    <span>{getEventLabel(task.event_type)}</span>
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

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Badge className={`text-xs ${getStatusColor(task.status)}`} style={{ borderRadius: "3px" }}>
                    <span className="text-xs">{task.status}</span>
                  </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {TaskStatus.filter((status) => status.value !== task.status).map((status) => (
                    <DropdownMenuItem key={status.value} onClick={() => onStatusChange(task.id, status.value)}>
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
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{getText(task.description,50)}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <UserIcon className="w-3 h-3" />
              <span>{task.responsible}</span>
            </div>

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
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default TaskCard;
