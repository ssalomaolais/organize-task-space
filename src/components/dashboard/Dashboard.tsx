import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { User } from "@/types/auth";
import { Task } from "@/types/task";
import { TaskStatus, Stacks } from "@/lib/utils";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { Search, Plus, User as UserIcon } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

type ViewMode = "semester" | "year";

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const { tasks, loading, createTask, updateTask, deleteTask, updateTaskStatus } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stackFilter, setStackFilter] = useState<string | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("semester");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showCardContent, setShowCardContent] = useState<boolean>(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filtros e funções de utilidade

  useEffect(() => {
    let filtered = tasks.sort((a, b) => {
      const dateComparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      if (dateComparison === 0) {
        return (a.stack || '').localeCompare(b.stack || '');
      }
      return dateComparison;
    });

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.responsible.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (stackFilter !== "all") {
      filtered = filtered.filter((task) => task.stack === stackFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, stackFilter, statusFilter]);

  const handleCreateTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    await createTask(taskData);
    setShowTaskForm(false);
  };

  const handleUpdateTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    if (!editingTask) return;
    await updateTask(editingTask.id, taskData);
    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    await updateTaskStatus(taskId, newStatus);
  };

  // Funções de utilitários e helper functions

  const getSemesterFromDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    return month <= 6 ? 1 : 2;
  };

  const getMonthFromDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getMonth() + 1;
  };

  const getMonthName = (month: number) => {
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return months[month - 1];
  };

  const getTasksBySemester = (year: number, semester: number) => {
    return filteredTasks.filter((task) => {
      const startDate = new Date(task.startDate);
      const taskYear = startDate.getFullYear();
      const taskSemester = getSemesterFromDate(task.startDate);
      return taskYear === year && taskSemester === semester;
    });
  };

  const getTasksByMonth = (year: number, month: number) => {
    return filteredTasks.filter((task) => {
      const startDate = new Date(task.startDate);
      const taskStartMonth = getMonthFromDate(task.startDate);
      const taskStartYear = startDate.getFullYear();
      return taskStartYear === year && taskStartMonth === month;
    });
  };

  const getTasksByYear = (year: number) => {
    return filteredTasks.filter((task) => {
      const startDate = new Date(task.startDate);
      return startDate.getFullYear() === year;
    });
  };

  const getAvailableYears = () => {
    const years = new Set<number>();
    tasks.forEach((task) => {
      years.add(new Date(task.startDate).getFullYear());
    });
    return Array.from(years).sort();
  };

  const getSemesterName = (semester: number) => {
    return semester === 1 ? "1º Semestre" : "2º Semestre";
  };

  const taskStatuses = [
    { value: "all", label: "Todos Status" },
    { value: "Pendente", label: "Pendente" },
    { value: "Em Andamento", label: "Em Andamento" },
    { value: "Completo", label: "Completo" },
    { value: "Cancelado", label: "Cancelado" },
  ];

  // renderSemesterView e renderYearView functions

  const renderSemesterView = () => {
    return (
      <div className="space-y-8">
        {[1, 2].map((semester) => {
          const semesterTasks = getTasksBySemester(selectedYear, semester);
          const monthsInSemester = semester === 1 ? [1, 2, 3, 4, 5, 6] : [7, 8, 9, 10, 11, 12];
          const monthsWithTasks = monthsInSemester.filter((month) => getTasksByMonth(selectedYear, month).length > 0);

          return (
            <div key={semester} className="rounded-lg border-2 border-gray-200 bg-gray-50">
              <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">
                    {getSemesterName(semester)} {selectedYear}
                  </h3>
                  <Badge variant="outline">{semesterTasks.length}</Badge>
                </div>
              </div>

              <div className="p-4">
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
                                    onEdit={setEditingTask}
                                    onDelete={handleDeleteTask}
                                    onStatusChange={handleStatusChange}
                                    userRole={user.role}
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
                    <p className="text-sm">Nenhuma tarefa neste semestre</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderYearView = () => {
    const yearTasks = getTasksByYear(selectedYear);
    const monthsWithTasks = Array.from(new Set(yearTasks.map((task) => getMonthFromDate(task.startDate)))).sort();

    return (
      <div className="rounded-lg border-2 border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Ano {selectedYear}</h3>
            <Badge variant="outline">{yearTasks.length}</Badge>
          </div>
        </div>

        <div className="p-4">
          {monthsWithTasks.length > 0 ? (
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4 pb-4">
                {monthsWithTasks.map((month) => {
                  const monthTasks = getTasksByMonth(selectedYear, month);

                  return (
                    <div key={month} className="flex-shrink-0 w-80 bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-sm text-gray-700">{getMonthName(month)}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {monthTasks.length}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {monthTasks.map((task) => (
                          <div key={task.id} className="space-y-2">
                            <TaskCard
                              task={task}
                              onEdit={setEditingTask}
                              onDelete={handleDeleteTask}
                              onStatusChange={handleStatusChange}
                              userRole={user.role}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando tarefas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">TF</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">TaskFlow</h1>
              <p className="text-sm text-gray-500">Gerenciamento de Tarefas</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{user.name}</span>
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                {user.role === "admin" ? "Admin" : user.stack}
              </Badge>
            </div>
            <Button variant="outline" onClick={onLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Filters and Actions */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Buscar tarefas..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10" 
              />
            </div>

            {user.role === "admin" && (
              <Select onValueChange={(value: string | "all") => setStackFilter(value)} defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Stack" />
                </SelectTrigger>
                <SelectContent>
                  {Stacks.map((stack) => (
                    <SelectItem key={stack.value} value={stack.value}>
                      {stack.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select onValueChange={(value: string | "all") => setStatusFilter(value)} defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {taskStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value: string) => setSelectedYear(parseInt(value))} defaultValue={selectedYear.toString()}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableYears().map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setViewMode(value as ViewMode)} defaultValue="semester">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Visualização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semester">Semestral</SelectItem>
                <SelectItem value="year">Anual</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setShowCardContent(value === "true")} defaultValue={showCardContent.toString()}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Exibir Conteúdo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Mostrar Conteúdo</SelectItem>
                <SelectItem value="false">Ocultar Conteúdo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => setShowTaskForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* View Mode Toggle and Content */}
      <div className="p-6">
        <Tabs value={viewMode} onValueChange={(value: string) => setViewMode(value as ViewMode)} className="space-y-4">
          <TabsContent value="semester">{renderSemesterView()}</TabsContent>
          <TabsContent value="year">{renderYearView()}</TabsContent>
        </Tabs>
      </div>

      {/* Task Form Modal */}
      {(showTaskForm || editingTask) && (
        <TaskForm
          task={editingTask}
          user={user}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
