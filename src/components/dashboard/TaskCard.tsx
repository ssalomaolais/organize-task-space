
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Task, TaskStatus } from "@/types/task";
import { UserRole } from "@/types/auth";
import { Calendar, Clock, User, Edit, Trash, User as UserIcon } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  userRole: UserRole;
}

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, userRole }: TaskCardProps) => {
  const getStackColor = (stack: string) => {
    switch (stack) {
      case "Java": return "bg-orange-100 text-orange-800";
      case ".NET": return "bg-purple-100 text-purple-800";
      case "PHP": return "bg-blue-100 text-blue-800";
      case "Python": return "bg-green-100 text-green-800";
      case "Dados": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getDaysRemaining = () => {
    const endDate = new Date(task.endDate);
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
            <Badge className={`text-xs ${getStackColor(task.stack)}`}>
              {task.stack}
            </Badge>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <Edit className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              {userRole === "admin" && (
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="text-red-600"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <UserIcon className="w-3 h-3" />
            <span>{task.responsible}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(task.startDate)} - {formatDate(task.endDate)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{task.hours}h • {task.people} pessoa{task.people > 1 ? 's' : ''}</span>
          </div>
          
          {task.status !== "Completo" && task.status !== "Cancelado" && (
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="w-3 h-3" />
              <span className={daysRemaining < 0 ? "text-red-600" : daysRemaining <= 3 ? "text-yellow-600" : "text-gray-500"}>
                {daysRemaining < 0 ? `${Math.abs(daysRemaining)} dias em atraso` : 
                 daysRemaining === 0 ? "Vence hoje" :
                 `${daysRemaining} dias restantes`}
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-3 flex gap-1">
          {(["Pendente", "Em Andamento", "Completo", "Cancelado"] as TaskStatus[])
            .filter(status => status !== task.status)
            .map((status) => (
              <Button
                key={status}
                variant="outline"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={() => onStatusChange(task.id, status)}
              >
                {status}
              </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
