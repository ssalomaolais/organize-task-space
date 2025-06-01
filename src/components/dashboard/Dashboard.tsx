
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stackFilter, setStackFilter] = useState<Stack | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
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
        startDate: "2024-06-01",
        endDate: "2024-06-15",
        hours: 40,
        people: 2,
        status: "Em Andamento",
        stack: "Java",
        createdAt: "2024-06-01",
        updatedAt: "2024-06-01",
      },
      {
        id: "2",
        title: "Dashboard de métricas",
        description: "Criar dashboard com gráficos de performance",
        responsible: "Maria Santos",
        startDate: "2024-06-10",
        endDate: "2024-06-25",
        hours: 60,
        people: 3,
        status: "Pendente",
        stack: "Python",
        createdAt: "2024-06-01",
        updatedAt: "2024-06-01",
      },
      {
        id: "3",
        title: "Migração de banco de dados",
        description: "Migrar dados do sistema legado",
        responsible: "Carlos Lima",
        startDate: "2024-05-15",
        endDate: "2024-05-30",
        hours: 80,
        people: 1,
        status: "Completo",
        stack: ".NET",
        createdAt: "2024-05-15",
        updatedAt: "2024-05-30",
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

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "Pendente": return "bg-gray-100 border-gray-300";
      case "Em Andamento": return "bg-blue-50 border-blue-300";
      case "Completo": return "bg-green-50 border-green-300";
      case "Cancelado": return "bg-red-50 border-red-300";
    }
  };

  const getStatusCount = (status: TaskStatus) => {
    return getTasksByStatus(status).length;
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
          </div>
          
          <Button onClick={() => setShowTaskForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(["Pendente", "Em Andamento", "Completo", "Cancelado"] as TaskStatus[]).map((status) => (
            <div key={status} className={`rounded-lg border-2 ${getStatusColor(status)} min-h-96`}>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{status}</h3>
                  <Badge variant="outline">{getStatusCount(status)}</Badge>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {getTasksByStatus(status).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={setEditingTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                    userRole={user.role}
                  />
                ))}
                
                {getTasksByStatus(status).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Nenhuma tarefa</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
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
