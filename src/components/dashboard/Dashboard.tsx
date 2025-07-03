import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { User } from "@/types/auth";
import { Task } from "@/types/task";
import TaskForm from "./TaskForm";
import UsersPage from "@/components/users/UsersPage";
import { Search, Plus, User as UserIcon, Settings } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useStack } from "@/hooks/useStack";
import { useEventType } from "@/hooks/useEventType";
import { CalendarView } from "@/components/dashboard/CalendarView";
import { HorizontalView } from "@/components/dashboard/HorizontalView";
import { VerticalView } from "@/components/dashboard/VerticalView";
import { UpcomingView } from "@/components/dashboard/UpcomingView";
import { EventsGridView } from "@/components/dashboard/EventsGridView";
import { TaskStatus, NextEvents } from "@/lib/utils";
import EventTypesPage from "@/components/event_types/EventTypesPage";
import StacksPage from "@/components/stacks/StacksPage";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

type ViewMode = "semester" | "year" | "calendar" | "upcoming" | "events-grid";
type ManagementPage = "none" | "users" | "event-types" | "stacks";
type PaletteType = "minsait" | "indra";

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const { tasks, loading, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskType } = useTasks();
  const { stack } = useStack();
  const { eventType } = useEventType();

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stackFilter, setStackFilter] = useState<string | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");
  const [eventTypeFilter, setEventTypeFilter] = useState<string | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("semester");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showCardContent, setShowCardContent] = useState<boolean>(true);
  const [palette, setPalette] = useState<PaletteType>("minsait");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentManagementPage, setCurrentManagementPage] = useState<ManagementPage>("none");

  useEffect(() => {
    let filtered = tasks.sort((a, b) => {
      const dateComparison = new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
      if (dateComparison === 0) {
        return (a.stack || "").localeCompare(b.stack || "");
      }
      return dateComparison;
    });

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.subtitle != undefined && task.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
    if (eventTypeFilter !== "all") {
      filtered = filtered.filter((task) => task.event_type === eventTypeFilter);
    }
    setFilteredTasks(filtered);
  }, [tasks, searchTerm, stackFilter, statusFilter, eventTypeFilter]);

  if (currentManagementPage === "users") {
    return <UsersPage stack={stack} onBack={() => setCurrentManagementPage("none")} />;
  }

  if (currentManagementPage === "event-types") {
    return <EventTypesPage onBack={() => setCurrentManagementPage("none")} />;
  }

  if (currentManagementPage === "stacks") {
    return <StacksPage onBack={() => setCurrentManagementPage("none")} />;
  }

  const setViewModeCombo = (value:ViewMode) =>{
      setViewMode(value);
      setPalette("minsait");
  }
  const handleCreateTask = async (taskData: Omit<Task, "id" | "created_at" | "updated_at">) => {
    await createTask(taskData);
    setShowTaskForm(false);
  };

  const handleUpdateTask = async (taskData: Omit<Task, "id" | "created_at" | "updated_at">) => {
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

  const handleTypeChange = async (taskId: string, newType: string) => {
    await updateTaskType(taskId, newType);
  };

  const getAvailableYears = () => {
    const years = new Set<number>();
    tasks.forEach((task) => {
      years.add(new Date(task.start_date).getFullYear());
    });
    return Array.from(years).sort();
  };

  const renderSemesterView = () => {
    return (
      <VerticalView
        filteredTasks={filteredTasks}
        selectedYear={selectedYear}
        stack={stack}
        eventType={eventType}
        role={user.role}
        showCardContent={showCardContent}
        setEditingTask={setEditingTask}
        handleDeleteTask={handleDeleteTask}
        handleStatusChange={handleStatusChange}
        handleTypeChange={handleTypeChange}
      />
    );
  };

  const renderYearView = () => {
    return (
      <HorizontalView
        filteredTasks={filteredTasks}
        selectedYear={selectedYear}
        stack={stack}
        eventType={eventType}
        role={user.role}
        showCardContent={showCardContent}
        setEditingTask={setEditingTask}
        handleDeleteTask={handleDeleteTask}
        handleStatusChange={handleStatusChange}
        handleTypeChange={handleTypeChange}
      />
    );
  };

  const renderUpcomingView = () => {
    return (
      <UpcomingView
        filteredTasks={filteredTasks}
        selectedYear={selectedYear}
        stack={stack}
        eventType={eventType}
        role={user.role}
        showCardContent={showCardContent}
        setEditingTask={setEditingTask}
        handleDeleteTask={handleDeleteTask}
        handleStatusChange={handleStatusChange}
        handleTypeChange={handleTypeChange}
      />
    );
  };

  const renderCalendarView = () => {
    return <CalendarView tasks={tasks} user={user} stack={stack} eventType={eventType} onUpdateTask={handleUpdateTask}  onDeleteTask={handleDeleteTask} />;
  };

  const renderEventsGridView = () => {
    return <EventsGridView filteredTasks={filteredTasks} palette={palette} setEditingTask={setEditingTask}/>;
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-600">Carregando tarefas...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role === "admin" ? "Admin" : user.stack}</Badge>
            </div>
            {user.role === "admin" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Gerenciar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setCurrentManagementPage("users")}>
                    Usuários
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCurrentManagementPage("event-types")}>
                    Tipos de Eventos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentManagementPage("stacks")}>
                    Comunidades
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button variant="outline" onClick={onLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>
      
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input placeholder="Buscar tarefas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            {user.role === "admin" && (
              <Select onValueChange={(value) => setStackFilter(value)} defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Stack" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Stacks</SelectItem>
                  {stack.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}
                </SelectContent>
              </Select>
            )}
            <Select onValueChange={(value) => setStatusFilter(value)} defaultValue="all">
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                {TaskStatus.map((status) => (<SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setEventTypeFilter(value)} defaultValue="all">
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Tipo Evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Eventos</SelectItem>
                {eventType.map((item) => (<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setSelectedYear(parseInt(value))} defaultValue={selectedYear.toString()}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableYears().map((year) => (<SelectItem key={year} value={year.toString()}>{year}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setViewModeCombo(value as ViewMode)} defaultValue="semester">
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Visualização" />
              </SelectTrigger>
              <SelectContent>
                {NextEvents.map((item) => (<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>))}
              </SelectContent>
            </Select>
            {(viewMode==="events-grid") &&(
            <Select onValueChange={(value) => setPalette(value as PaletteType)} defaultValue="minsait">
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Paleta" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="minsait">Minsait</SelectItem>
                <SelectItem value="indra">Indra</SelectItem>
              </SelectContent>
            </Select>)}
          </div>
          <Button onClick={() => setShowTaskForm(true)} className="flex items-center gap-2"><Plus className="w-4 h-4" />Nova Tarefa</Button>
        </div>
      </div>
      
      <div className="p-0">
        <Tabs value={viewMode} className="w-full">
          <TabsContent value="semester" className="mt-0">{renderSemesterView()}</TabsContent>
          <TabsContent value="year" className="mt-0">{renderYearView()}</TabsContent>
          <TabsContent value="calendar" className="mt-0">{renderCalendarView()}</TabsContent>
          <TabsContent value="upcoming" className="mt-0">{renderUpcomingView()}</TabsContent>
          <TabsContent value="events-grid" className="mt-0">{renderEventsGridView()}</TabsContent>
        </Tabs>
      </div>
      
      {(showTaskForm || editingTask) && (
        <TaskForm
          task={editingTask}
          user={user}
          stack={stack}
          eventType={eventType}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onDelete={(id) => { handleDeleteTask(id); setEditingTask(null); }}
          onCancel={() => { setShowTaskForm(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
};

export default Dashboard;