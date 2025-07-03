import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TaskCard from "./TaskCard";
import { getMonthName, getMonthFromDate } from "@/lib/utils";
import { Task } from "@/types/task";
import { UserRole } from "@/types/auth";
import { ListValue } from "@/types/task";
import React from "react";

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

  const [hideYear, setHideYear] = React.useState<{ [key: number]: boolean }>({});
  const [hideMonth, setHideMonth] = React.useState<{ [key: string]: boolean }>({});
  const handleToggleYear = (year: number) => { setHideYear((prev) => ({ ...prev, [year]: !prev[year] })); };
  const handleToggleMonth = (year: number, month: number) => { setHideMonth((prev) => ({ ...prev, [`${year}-${month}`]: !prev[`${year}-${month}`] })); };

  return (
    <div className="rounded-lg border-2 border-gray-200 bg-gray-50">
      <div className="p-2 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Ano {selectedYear}</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{yearTasks.length}</Badge>
            <button type="button" onClick={() => handleToggleYear(selectedYear)} className="focus:outline-none" aria-label={hideYear[selectedYear] ? "Mostrar ano" : "Ocultar ano"} >
            {hideYear[selectedYear] ? ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye-closed"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4" /><path d="M3 15l2.5 -3.8" /><path d="M21 14.976l-2.492 -3.776" /><path d="M9 17l.5 -4" /><path d="M15 17l-.5 -4" /></svg>)
            : ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg> )}
            </button>
          </div>
        </div>
      </div>

      {!hideYear[selectedYear] && (
        <div className="p-2">
          {monthsWithTasks.length > 0 ? (
            <ScrollArea className="w-full">
              <div className="flex flex-wrap gap-4 pb-4">
                {monthsWithTasks.map((month) => {
                  const monthTasks = getTasksByMonth(selectedYear, month);
                  const key = `${selectedYear}-${month}`;
                  return (
                    <div key={month} className="flex-auto min-w-[280px] max-w-full bg-white rounded-lg border border-gray-200 p-1">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-sm text-gray-700">{getMonthName(month)}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{monthTasks.length}</Badge>
                            <button type="button" onClick={() => handleToggleMonth(selectedYear, month)} className="focus:outline-none" aria-label={hideMonth[key] ? "Mostrar mês" : "Ocultar mês"} >
                              {hideMonth[key] ? ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye-closed"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4" /><path d="M3 15l2.5 -3.8" /><path d="M21 14.976l-2.492 -3.776" /><path d="M9 17l.5 -4" /><path d="M15 17l-.5 -4" /></svg>)
                              : ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg> )}
                            </button>
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