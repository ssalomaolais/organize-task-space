import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Task } from "@/types/task";
import { TaskStatus, TypeOptions, Stacks, getStatusColor } from "@/lib/utils";
import { UserRole } from "@/types/auth";
import { Calendar, Clock, User, Edit, User as UserIcon } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: string) => void;
  onTypeChange: (taskId: string, type: string) => void;
  userRole: UserRole;
  showContent?: boolean;
}

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, onTypeChange: onStatusType, userRole, showContent = true }: TaskCardProps) => {
  const getStackColor = (stack: string) => {
    return Stacks.find((s) => s.value === stack)?.color || "bg-gray-100 text-gray-800";
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case "FT":
        return "bg-orange-100 text-orange-500";
      case "MI":
        return "bg-purple-100 text-purple-800";
      case "ME":
        return "bg-blue-100 text-blue-800";
      case "TI":
        return "bg-green-100 text-green-800";
      case "TE":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  const daysRemaining = getDaysRemaining();

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-2 leading-tight">{task.title}</h4>
            <div className="flex gap-1 flex-wrap mb-2">
              <Badge className={`text-xs ${getStackColor(task.stack)}`}>{task.stack}</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Badge className={`text-xs ${getEventTypeColor(task.event_type)}`}>
                    <span className="text-xs">{task.event_type}</span>
                  </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {TypeOptions.filter((status) => status.value !== task.status).map((status) => (
                    <DropdownMenuItem key={status.value} onClick={() => onStatusType(task.id, status.value)}>
                      <span className="text-xs h-6 px-2">{status.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Badge className={`text-xs ${getStatusColor(task.status)}`}>
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
              <Badge className={`text-xs bg-gray-100 text-gray-800`}>{task.people}</Badge>
            </div>
          </div>

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 m-0" onClick={() => onEdit(task)}>
            <span className="sr-only">Editar</span>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {showContent && (
        <CardContent className="pt-0">
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>

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
