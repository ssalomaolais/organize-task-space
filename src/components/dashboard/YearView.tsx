import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TaskCard from "./TaskCard";
import { getMonthName, getMonthFromDate } from "@/lib/utils";
import { Task } from "@/types/task";
import { UserRole } from "@/types/auth";
import { ListValue } from "@/types/task";

interface YearViewProps {
  filteredTasks: Task[];
  stack: ListValue[] | [];
  eventType: ListValue[] | [];  
  selectedYear: number;
  role:UserRole;
  showCardContent:boolean;
  setEditingTask: (task:Task) => void;
  handleDeleteTask: (taskId:string) => void;
  handleStatusChange: (taskId: string, newStatus: string)=> void;
  handleTypeChange: (taskId: string, newType: string)=> void;
}

export const YearView = ({ role, showCardContent, filteredTasks, selectedYear, stack, eventType, setEditingTask, handleDeleteTask, handleStatusChange, handleTypeChange }: YearViewProps) => {

  const getTasksByMonth = (year: number, month: number) => {
    return filteredTasks.filter((task) => {
      const startDate = new Date(task.start_date);
      const taskStartMonth = getMonthFromDate(task.start_date);
      const taskStartYear = startDate.getFullYear();
      return taskStartYear === year && taskStartMonth === month;
    });
  };

  const getTasksByYear = (year: number) => {
    return filteredTasks.filter((task) => {
      const startDate = new Date(task.start_date);
      return startDate.getFullYear() === year;
    });
  };

  const yearTasks = getTasksByYear(selectedYear);
  const monthsWithTasks = Array.from(new Set(yearTasks.map((task) => getMonthFromDate(task.start_date)))).sort();

  return (
    <div className="rounded-lg border-2 border-gray-200 bg-gray-50">
      <div className="p-2 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Ano {selectedYear}</h3>
          <Badge variant="outline">{yearTasks.length}</Badge>
        </div>
      </div>

      <div className="p-2">
        {monthsWithTasks.length > 0 ? (
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-1 pb-4">
              {monthsWithTasks.map((month) => {
                const monthTasks = getTasksByMonth(selectedYear, month);

                return (
                  <div key={month} className="flex-shrink-0 w-80 bg-white rounded-lg border border-gray-200 p-1">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-sm text-gray-700">{getMonthName(month)}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {monthTasks.length}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      {monthTasks.map((task) => (
                        <div key={task.id} className="space-y-1">
                          <TaskCard
                            task={task}
                            stack={stack}
                            eventType={eventType}                            
                            onEdit={setEditingTask}
                            onDelete={handleDeleteTask}
                            onStatusChange={handleStatusChange}
                            onTypeChange={handleTypeChange}
                            userRole={role}
                            showContent={showCardContent}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Nenhuma tarefa neste ano</p>
          </div>
        )}
      </div>
    </div>
  );
};
