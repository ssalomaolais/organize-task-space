import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TaskCard from "./TaskCard";
import { getMonthName, getMonthFromDate, getSemesterFromDate, getSemesterName } from "@/lib/utils";
import { Task } from "@/types/task";
import { UserRole } from "@/types/auth";
import { ListValue } from "@/types/task";
import React from "react";

interface VerticalViewProps {
  filteredTasks: Task[];
  stack: ListValue[] | [];
  eventType: ListValue[] | [];
  selectedYear: number;
  role: UserRole;
  showCardContent: boolean;
  colorType: string;
  setEditingTask: (task: Task) => void;
  handleDeleteTask: (taskId: string) => void;
  handleStatusChange: (taskId: string, newStatus: string) => void;
  handleTypeChange: (taskId: string, newType: string) => void;
}

export const VerticalView = ({ role, showCardContent, filteredTasks, selectedYear, stack, eventType, setEditingTask, handleDeleteTask, handleStatusChange, handleTypeChange }: VerticalViewProps) => {
  const getTasksBySemester = (year: number, semester: number) => {
    return filteredTasks.filter((task) => {
      const startDate = new Date(task.start_date);
      const taskYear = startDate.getFullYear();
      const taskSemester = getSemesterFromDate(task.start_date);
      return taskYear === year && taskSemester === semester;
    });
  };

  const getTasksByMonth = (year: number, month: number) => {
    return filteredTasks.filter((task) => {
      const startDate = new Date(task.start_date);
      const taskStartMonth = getMonthFromDate(task.start_date);
      const taskStartYear = startDate.getFullYear();
      return taskStartYear === year && taskStartMonth === month;
    });
  };

  const [hideSemester, setHideSemester] = React.useState<{ [key: number]: boolean }>({});
  const [hideMonth, setHideMonth] = React.useState<{ [key: string]: boolean }>({});
  const handleToggleSemester = (semester: number) => { setHideSemester((prev) => ({ ...prev, [semester]: !prev[semester] })); };
  const handleToggleMonth = (semester: number, month: number) => { setHideMonth((prev) => ({ ...prev, [`${semester}-${month}`]: !prev[`${semester}-${month}`] })); };
  const [colorType] = React.useState<string>("bg-white");

  return (
    <div className="space-y-8">
      {[1, 2].map((semester) => {
        const semesterTasks = getTasksBySemester(selectedYear, semester);
        const monthsInSemester = semester === 1 ? [1, 2, 3, 4, 5, 6] : [7, 8, 9, 10, 11, 12];
        const monthsWithTasks = monthsInSemester.filter((month) => getTasksByMonth(selectedYear, month).length > 0);

        return (
          <div key={semester} className="rounded-lg border-2 border-gray-200 bg-gray-50">
            <div className="p-2 border-b border-gray-200 bg-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">
                  {getSemesterName(semester)} {selectedYear}
                </h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{semesterTasks.length}</Badge>
                  <button type="button" onClick={() => handleToggleSemester(semester)} className="focus:outline-none" aria-label={hideSemester[semester] ? "Mostrar ano" : "Ocultar ano"} >
                    {hideSemester[semester] ? (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye-closed"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4" /><path d="M3 15l2.5 -3.8" /><path d="M21 14.976l-2.492 -3.776" /><path d="M9 17l.5 -4" /><path d="M15 17l-.5 -4" /></svg>)
                      : (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>)}
                  </button>
                </div>
              </div>
            </div>
            {!hideSemester[semester] && (
              <div className="p-0">
                {monthsWithTasks.length > 0 ? (
                  <ScrollArea className="w-full">
                    <div className="flex space-x-1 pb-0">
                      {monthsWithTasks.map((month) => {
                        const monthTasks = getTasksByMonth(selectedYear, month);
                        const key = `${semester}-${month}`;
                        return (
                          <div key={month} className={`flex-shrink-0 w-[312px] rounded-lg border border-gray-200 p-1 ${colorType}`}>
                            <div className="flex items-center justify-between mb-4">
                              <h4  className={`font-medium text-sm ${colorType==="minsait"?"text-white":"text-gray-700"}`}>{getMonthName(month)}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className={colorType === "minsait" ? "text-white" : "text-black-700"}>{monthTasks.length}</Badge>
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
                    <p className="text-sm">Nenhuma tarefa neste semestre</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};