import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { User } from "@/types/auth";
import { Task } from "@/types/task";
import TaskForm from "../task/TaskForm";

import { Search, Plus } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useStack } from "@/hooks/useStack";
import { useEventType } from "@/hooks/useEventType";
import { CalendarView } from "@/components/dashboard/CalendarView";
import { HorizontalView } from "@/components/dashboard/HorizontalView";
import { VerticalView } from "@/components/dashboard/VerticalView";
import { UpcomingView } from "@/components/dashboard/UpcomingView";
import { EventsGridView } from "@/components/dashboard/EventsGridView";
import { TaskStatus, NextEvents, GradeLayoutOptions } from "@/lib/utils";
import {Loading} from "../shared/loading";
import { MultiSelect, Option } from "@/components/ui/multi-select";

interface DashboardProps {
    user: User;
    colorType: string;
}

type ViewMode = "grade" | "calendar" | "upcoming" | "events-grid";
type GradeLayout = "vertical" | "horizontal";
type PaletteType = "minsait" | "indra";

const Dashboard = ({ user, colorType }: DashboardProps) => {
    const { tasks, loading, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskType } = useTasks();
    const { stack } = useStack();
    const { eventType } = useEventType();
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [stackFilter, setStackFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [eventTypeFilter, setEventTypeFilter] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>("grade");
    const [gradeLayout, setGradeLayout] = useState<GradeLayout>("vertical");
    const [selectedSemesters, setSelectedSemesters] = useState<string[]>([]);
    const [showCardContent, setShowCardContent] = useState<boolean>(true);
    const [palette, setPalette] = useState<PaletteType>("minsait");
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

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
        
        // Filtro de Stack - se não há filtros selecionados, mostra todas
        if (stackFilter.length > 0) {
            filtered = filtered.filter((task) => task.stack && stackFilter.includes(task.stack));
        }
        
        // Filtro de Status - se não há filtros selecionados, mostra todas
        if (statusFilter.length > 0) {
            filtered = filtered.filter((task) => task.status && statusFilter.includes(task.status));
        }
        
        // Filtro de Tipo de Evento - se não há filtros selecionados, mostra todas
        if (eventTypeFilter.length > 0) {
            filtered = filtered.filter((task) => task.event_type && eventTypeFilter.includes(task.event_type));
        }
        
        // Filtro de Semestre - se não há filtros selecionados, mostra todas
        if (selectedSemesters.length > 0) {
            filtered = filtered.filter((task) => {
                const date = new Date(task.start_date);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const semester = month <= 6 ? 1 : 2;
                const taskSemester = `${semester}/${year}`;
                return selectedSemesters.includes(taskSemester);
            });
        }
        
        setFilteredTasks(filtered);
    }, [tasks, searchTerm, stackFilter, statusFilter, eventTypeFilter, selectedSemesters]);


    const setViewModeCombo = (value: ViewMode) => {
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

    const getAvailableSemesters = (): Option[] => {
        const semesters = new Set<string>();
        
        tasks.forEach((task) => {
            const date = new Date(task.start_date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const semester = month <= 6 ? 1 : 2;
            semesters.add(`${semester}/${year}`);
        });
        
        return Array.from(semesters)
            .sort((a, b) => {
                const [semA, yearA] = a.split('/').map(Number);
                const [semB, yearB] = b.split('/').map(Number);
                
                if (yearA !== yearB) return yearA - yearB;
                return semA - semB;
            })
            .map(semester => ({
                value: semester,
                label: `${semester}º Semestre`
            }));
    };

    const renderGradeView = () => {
        if (gradeLayout === "vertical") {
            return (
                <VerticalView
                    filteredTasks={filteredTasks}
                    selectedYear={new Date().getFullYear()}
                    selectedSemesters={selectedSemesters}
                    stack={stack}
                    eventType={eventType}
                    role={user.role}
                    showCardContent={showCardContent}
                    colorType={colorType}
                    setEditingTask={setEditingTask}
                    handleDeleteTask={handleDeleteTask}
                    handleStatusChange={handleStatusChange}
                    handleTypeChange={handleTypeChange}
                />
            );
        } else {
            return (
                <HorizontalView
                    filteredTasks={filteredTasks}
                    selectedYear={new Date().getFullYear()}
                    stack={stack}
                    eventType={eventType}
                    role={user.role}
                    showCardContent={showCardContent}
                    colorType={colorType}
                    setEditingTask={setEditingTask}
                    handleDeleteTask={handleDeleteTask}
                    handleStatusChange={handleStatusChange}
                    handleTypeChange={handleTypeChange}
                />
            );
        }
    };

    const renderUpcomingView = () => {
        return (
            <UpcomingView
                filteredTasks={filteredTasks}
                selectedYear={new Date().getFullYear()}
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
        return <CalendarView tasks={tasks} user={user} stack={stack} eventType={eventType} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />;
    };

    const renderEventsGridView = () => {
        return <EventsGridView filteredTasks={filteredTasks} palette={palette} setEditingTask={setEditingTask} />;
    }

    if (loading)
    {
        return <Loading loading={loading} />;
    }

    return (
        <>
            <div className={`sticky top-16 z-40 px-1 py-2 border-b border-gray-200 ${colorType}`}>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-wrap items-center gap-4 flex-1">
                        <div className="relative flex-1 min-w-[200px] max-w-xs">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input placeholder="Buscar tarefas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 text-black" />
                        </div>
                        {user.role === "admin" && (
                            <MultiSelect
                                options={stack}
                                selectedValues={stackFilter}
                                onSelectionChange={setStackFilter}
                                placeholder="Categorias"
                                className="w-full sm:w-40"
                                showAllOption={true}
                                allOptionLabel="Todas as Stacks"
                            />
                        )}

                        <MultiSelect
                            options={eventType}
                            selectedValues={eventTypeFilter}
                            onSelectionChange={setEventTypeFilter}
                            placeholder="Evento"
                            className="w-full sm:w-40"
                            showAllOption={true}
                            allOptionLabel="Todos os Eventos"
                        />
                        <MultiSelect
                            options={TaskStatus}
                            selectedValues={statusFilter}
                            onSelectionChange={setStatusFilter}
                            placeholder="Status"
                            className="w-full sm:w-40"
                            showAllOption={true}
                            allOptionLabel="Todos os Status"
                        />                        
                        <MultiSelect
                            options={getAvailableSemesters()}
                            selectedValues={selectedSemesters}
                            onSelectionChange={setSelectedSemesters}
                            placeholder="Semestre"
                            className="w-full sm:w-40"
                            showAllOption={true}
                            allOptionLabel="Todos os Semestres"
                        />
                        <Select onValueChange={(value) => setViewModeCombo(value as ViewMode)} defaultValue="grade">
                            <SelectTrigger className="w-full sm:w-40  text-black">
                                <SelectValue placeholder="Visualização" />
                            </SelectTrigger>
                            <SelectContent>
                                {NextEvents.map((item) => (<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>))}
                            </SelectContent>
                        </Select>
                        
                        {viewMode === "grade" && (
                            <Select onValueChange={(value) => setGradeLayout(value as GradeLayout)} defaultValue="vertical">
                                <SelectTrigger className="w-full sm:w-40  text-black">
                                    <SelectValue placeholder="Layout" />
                                </SelectTrigger>
                                <SelectContent>
                                    {GradeLayoutOptions.map((item) => (<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        )}
                        {(viewMode === "events-grid") && (
                            <Select onValueChange={(value) => setPalette(value as PaletteType)} defaultValue="minsait">
                                <SelectTrigger className="w-full sm:w-40  text-black"><SelectValue placeholder="Paleta" /></SelectTrigger>
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
                    <TabsContent value="grade" className="mt-0">{renderGradeView()}</TabsContent>
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
        </>
    );
};

export default Dashboard;