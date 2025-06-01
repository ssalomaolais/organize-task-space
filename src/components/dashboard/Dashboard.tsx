import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { User } from "@/types/auth";
import { Task, TaskStatus, Stack } from "@/types/task";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { Search, Plus, Filter, Calendar, User as UserIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

type ViewMode = "semester" | "year";

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stackFilter, setStackFilter] = useState<Stack | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("semester");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Mock data para demonstração
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Implementar API de autenticação",
        description: "Desenvolver sistema de login e registro de usuários",
        responsible: "João Silva",
        startDate: "2024-01-15",
        endDate: "2024-04-15",
        hours: 40,
        people: 2,
        status: "Em Andamento",
        stack: "Java",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15",
      },
      {
        id: "2",
        title: "Dashboard de métricas",
        description: "Criar dashboard com gráficos de performance",
        responsible: "Maria Santos",
        startDate: "2024-07-10",
        endDate: "2024-09-25",
        hours: 60,
        people: 3,
        status: "Pendente",
        stack: "Python",
        createdAt: "2024-07-01",
        updatedAt: "2024-07-01",
      },
      {
        id: "3",
        title: "Migração de banco de dados",
        description: "Migrar dados do sistema legado",
        responsible: "Carlos Lima",
        startDate: "2024-08-15",
        endDate: "2024-12-30",
        hours: 80,
        people: 1,
        status: "Completo",
        stack: ".NET",
        createdAt: "2024-08-15",
        updatedAt: "2024-11-30",
      },
      {
        id: "4",
        title: "Sistema de relatórios",
        description: "Desenvolver módulo de relatórios automáticos",
        responsible: "Ana Costa",
        startDate: "2025-01-01",
        endDate: "2025-06-30",
        hours: 120,
        people: 4,
        status: "Pendente",
        stack: "PHP",
        createdAt: "2024-12-01",
        updatedAt: "2024-12-01",
      },
    ];
    setTasks(mockTasks);
  }, []);

  // Filtrar tarefas baseado nos filtros ativos
  useEffect(() => {
    let filtered = tasks;

    // Filtro por stack do usuário (se não for admin)
    if (user.role === "user" && user.stack) {
      filtered = filtered.filter(task => task.stack === user.stack);
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.responsible.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por stack
    if (stackFilter !== "all") {
      filtered = filtered.filter(task => task.stack === stackFilter);
    }

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, stackFilter, statusFilter, user]);

  const handleCreateTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setShowTaskForm(false);
    toast({
      title: "Sucesso!",
      description: "Tarefa criada com sucesso.",
    });
  };

  const handleUpdateTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    if (!editingTask) return;
    
    const updatedTask: Task = {
      ...taskData,
      id: editingTask.id,
      createdAt: editingTask.createdAt,
      updatedAt: new Date().toISOString(),
    };
    
    setTasks(tasks.map(task => task.id === editingTask.id ? updatedTask : task));
    setEditingTask(null);
    toast({
      title: "Sucesso!",
      description: "Tarefa atualizada com sucesso.",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Sucesso!",
      description: "Tarefa removida com sucesso.",
    });
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
        : task
    ));
    toast({
      title: "Status atualizado!",
      description: `Tarefa movida para ${newStatus}.`,
    });
  };

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
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[month - 1];
  };

  const getTasksBySemester = (year: number, semester: number) => {
    return filteredTasks.filter(task => {
      const startDate = new Date(task.startDate);
      const endDate = new Date(task.endDate);
      const taskYear = startDate.getFullYear();
      const taskSemester = getSemesterFromDate(task.startDate);
      
      return taskYear === year && (
        taskSemester === semester || 
        (startDate.getFullYear() === year && endDate.getFullYear() === year && 
         getSemesterFromDate(task.endDate) === semester)
      );
    });
  };

  const getTasksByMonth = (year: number, month: number) => {
    return filteredTasks.filter(task => {
      const startDate = new Date(task.startDate);
      const endDate = new Date(task.endDate);
      const taskStartMonth = getMonthFromDate(task.startDate);
      const taskStartYear = startDate.getFullYear();
      
      return taskStartYear === year && taskStartMonth === month;
    });
  };

  const getTasksByYear = (year: number) => {
    return filteredTasks.filter(task => {
      const startDate = new Date(task.startDate);
      const endDate = new Date(task.endDate);
      return startDate.getFullYear() === year || endDate.getFullYear() === year;
    });
  };

  const getAvailableYears = () => {
    const years = new Set<number>();
    tasks.forEach(task => {
      years.add(new Date(task.startDate).getFullYear());
      years.add(new Date(task.endDate).getFullYear());
    });
    return Array.from(years).sort();
  };

  const getSemesterName = (semester: number) => {
    return semester === 1 ? "1º Semestre" : "2º Semestre";
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "Pendente": return "bg-yellow-100 text-yellow-800";
      case "Em Andamento": return "bg-blue-100 text-blue-800";
      case "Completo": return "bg-green-100 text-green-800";
      case "Cancelado": return "bg-red-100 text-red-800";
    }
  };

  const renderSemesterView = () => {
    return (
      <div className="space-y-8">
        {[1, 2].map((semester) => {
          const semesterTasks = getTasksBySemester(selectedYear, semester);
          const monthsInSemester = semester === 1 ? [1, 2, 3, 4, 5, 6] : [7, 8, 9, 10, 11, 12];
          const monthsWithTasks = monthsInSemester.filter(month => getTasksByMonth(selectedYear, month).length > 0);
          
          return (
            <div key={semester} className="rounded-lg border-2 border-gray-200 bg-gray-50">
              <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{getSemesterName(semester)} {selectedYear}</h3>
                  <Badge variant="outline">{semesterTasks.length}</Badge>
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
                              <Badge variant="secondary" className="text-xs">{monthTasks.length}</Badge>
                            </div>
                            
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {monthTasks.map((task) => (
                                <div key={task.id} className="space-y-2">
                                  <TaskCard
                                    task={task}
                                    onEdit={setEditingTask}
                                    onDelete={handleDeleteTask}
                                    onStatusChange={handleStatusChange}
                                    userRole={user.role}
                                  />
                                  <div className="flex justify-center">
                                    <Badge className={getStatusColor(task.status)}>
                                      {task.status}
                                    </Badge>
                                  </div>
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
    const monthsWithTasks = Array.from(new Set(yearTasks.map(task => getMonthFromDate(task.startDate)))).sort();
    
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
                        <Badge variant="secondary" className="text-xs">{monthTasks.length}</Badge>
                      </div>
                      
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {monthTasks.map((task) => (
                          <div key={task.id} className="space-y-2">
                            <TaskCard
                              task={task}
                              onEdit={setEditingTask}
                              onDelete={handleDeleteTask}
                              onStatusChange={handleStatusChange}
                              userRole={user.role}
                            />
                            <div className="flex justify-center">
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                            </div>
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
              <Select onValueChange={(value: Stack | "all") => setStackFilter(value)} defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Stack" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Stacks</SelectItem>
                  <SelectItem value="Java">Java</SelectItem>
                  <SelectItem value=".NET">.NET</SelectItem>
                  <SelectItem value="PHP">PHP</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="Dados">Dados</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            <Select onValueChange={(value: TaskStatus | "all") => setStatusFilter(value)} defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Completo">Completo</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value: string) => setSelectedYear(parseInt(value))} defaultValue={selectedYear.toString()}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableYears().map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
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
        <Tabs value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)} className="space-y-4">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="semester">Visualização Semestral</TabsTrigger>
            <TabsTrigger value="year">Visualização Anual</TabsTrigger>
          </TabsList>
          
          <TabsContent value="semester">
            {renderSemesterView()}
          </TabsContent>
          
          <TabsContent value="year">
            {renderYearView()}
          </TabsContent>
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
