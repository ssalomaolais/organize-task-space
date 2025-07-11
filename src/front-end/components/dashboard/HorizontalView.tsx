import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TaskCard from "../task/TaskCard";
import { getMonthName, getMonthFromDate } from "@/lib/utils";
import { Task } from "@/types/task";
import { UserRole } from "@/types/auth";
import { ListValue } from "@/types/task";
import React from "react";

interface HorizontalViewProps {
  filteredTasks: Task[];
  stack: ListValue[];
  eventType: ListValue[];
  selectedYear: number;
  role: UserRole;
  showCardContent: boolean;
  colorType:string;
  setEditingTask: (task: Task) => void;
  handleDeleteTask: (taskId: string) => void;
  handleStatusChange: (taskId: string, newStatus: string) => void;
  handleTypeChange: (taskId: string, newType: string) => void;
}

export const HorizontalView = ({ role, showCardContent, filteredTasks, selectedYear, stack, eventType, setEditingTask, handleDeleteTask, handleStatusChange, handleTypeChange }: HorizontalViewProps) => {

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
  const monthsWithTasks = Array.from(new Set(yearTasks.map((task) => getMonthFromDate(task.start_date).toString().padStart(2, '0')))).sort();

  const [hideYear, setHideYear] = React.useState<{ [key: number]: boolean }>({});
  const [hideMonth, setHideMonth] = React.useState<{ [key: string]: boolean }>({});
  const handleToggleYear = (year: number) => { setHideYear((prev) => ({ ...prev, [year]: !prev[year] })); };
  const handleToggleMonth = (year: number, month: number) => { setHideMonth((prev) => ({ ...prev, [`${year}-${month}`]: !prev[`${year}-${month}`] })); };
  const [colorType] = React.useState<string>("bg-white");


  return (
    <div className="rounded-lg border-2 border-gray-200 bg-gray-50 pb-16">
      <div className={`p-2 border-b border-gray-200 ${colorType==="minsait"?"bg-minsait":""}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium ">Ano {selectedYear}</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{yearTasks.length}</Badge>
          </div>
        </div>
      </div>

      {!hideYear[selectedYear] && (
        <div className="p-0">
          {monthsWithTasks.length > 0 ? (
            <ScrollArea className="w-full">
              <div className="flex space-x-1 pb-0">
                {monthsWithTasks.map((monthX) => {
                  const month = parseInt(monthX);
                  const monthTasks = getTasksByMonth(selectedYear, month);
                  const key = `${selectedYear}-${month}`;
                  return (
                    <div key={month} className={`flex-shrink-0 w-[312px] rounded-lg border border-gray-200 p-1 ${colorType}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4  className={`font-medium text-sm  ${colorType==="minsait"?"text-white":"text-gray-700"}`}>{getMonthName(month)}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={colorType==="minsait"?"text-white":"text-black-700"}>{monthTasks.length}</Badge>
                        </div>
                      </div>

                      {!hideMonth[key] && (
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
                      )}
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
      )}
    </div>
  );
};