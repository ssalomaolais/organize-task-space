import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { User } from "@/types/auth";
import { Task } from "@/types/task";
import TaskForm from "../task/TaskForm";

import { Search, Plus, FileDown } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useStack } from "@/hooks/useStack";
import { useEventType } from "@/hooks/useEventType";
import { CalendarView } from "@/components/dashboard/CalendarView";
import { HorizontalView } from "@/components/dashboard/HorizontalView";
import { VerticalView } from "@/components/dashboard/VerticalView";
import { UpcomingView } from "@/components/dashboard/UpcomingView";
import { EventsGridView } from "@/components/dashboard/EventsGridView";
import { PowerPointExportModal } from "@/components/dashboard/PowerPointExportModal";
import { exportGridImageToPowerPoint } from "@/lib/powerpoint-export";
import { TaskStatusOptions, NextEventsOptions, GradeLayoutOptions } from "@/lib/utils";
import {Loading} from "../shared/loading";
import { MultiSelect, Option } from "@/components/ui/multi-select";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { EventsGridSVGExport } from "@/components/dashboard/EventsGridSVGExport";
import { svgComponentToPngBase64 } from "@/lib/svg-to-image";
import ReactDOMServer from "react-dom/server";
import { drawCardsGridToCanvas } from "@/lib/draw-cards-grid-canvas";

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
    const [showPowerPointModal, setShowPowerPointModal] = useState(false);
    const gridRef = React.useRef<HTMLDivElement>(null);

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
        const result = await createTask(taskData);
        if (result.success) {
            setShowTaskForm(false);
        }
        // Se não foi bem-sucedido, o formulário permanece aberto
    };

    const handleUpdateTask = async (taskData: Omit<Task, "id" | "created_at" | "updated_at">) => {
        if (!editingTask) return;
        const result = await updateTask(editingTask.id, taskData);
        if (result.success) {
            setEditingTask(null);
        }
        // Se não foi bem-sucedido, o formulário permanece aberto
        return result; // Retornar o resultado para que outros componentes possam usar
    };

    const handleDeleteTask = async (taskId: string) => {
        await deleteTask(taskId);
    };

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        const result = await updateTaskStatus(taskId, newStatus);
        if (!result.success) {
            // Se falhou, pode mostrar uma mensagem adicional ou fazer algo específico
            console.error('Failed to update task status:', result.error);
        }
    };

    const handleTypeChange = async (taskId: string, newType: string) => {
        const result = await updateTaskType(taskId, newType);
        if (!result.success) {
            // Se falhou, pode mostrar uma mensagem adicional ou fazer algo específico
            console.error('Failed to update task type:', result.error);
        }
    };

    const handlePowerPointExport = async (title: string) => {
        try {
            if (viewMode === "events-grid") {
                // Montar dados dos cards
                const paletteObj = {
                    minsait: {
                        cardBackground: "#4f062a",
                        titleText: "#e4023f",
                        dateText: "#ffffff",
                        descriptionText: "#ffffff",
                        participantText: "#ffffff"
                    },
                    minsaitLight: {
                        cardBackground: "#ffffff",
                        titleText: "#63284b",
                        dateText: "#6b7280",
                        descriptionText: "#ff3d88",
                        participantText: "#63284b"
                    },
                    indra: {
                        cardBackground: "#00434F",
                        titleText: "#FFFFFF",
                        dateText: "#FFFFFF",
                        descriptionText: "#FFFFFF",
                        participantText: "#FFFFFF"
                    },
                    indraLight: {
                        cardBackground: "#ADD8E6",
                        titleText: "#000000",
                        dateText: "#000000",
                        descriptionText: "#000000",
                        participantText: "#000000"
                    }
                };
                const cards = filteredTasks.map((task, i) => {
                    const row = Math.floor(i / 6);
                    const scheme = palette === "minsait"
                        ? (row + i) % 2 !== 0 ? paletteObj.minsaitLight : paletteObj.minsait
                        : (row + i) % 2 !== 0 ? paletteObj.indraLight : paletteObj.indra;
                    return {
                        title: task.title,
                        description: task.description || "",
                        date: new Date(task.start_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + new Date(task.start_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                        people: task.people || 0,
                        palette: scheme
                    };
                });
                
                //const slideWidth = 1920; // ou 1280
                //const slideHeight = 1080; // ou 720
                const scale = 2; // Mantém a qualidade
                //const canvas = drawCardsGridToCanvas(cards, { width: slideWidth, height: slideHeight, scale });
                const canvas = drawCardsGridToCanvas(cards, { scale });
                const imageBase64 = canvas.toDataURL("image/png");

                // Exportar PowerPoint
                await exportGridImageToPowerPoint({ imageBase64, title, cards });
                
                /*
                // Exportar imagem PNG separadamente
                const pngLink = document.createElement('a');
                pngLink.download = `grid_${title}_${new Date().toISOString().slice(0, 10)}.png`;
                pngLink.href = imageBase64;
                document.body.appendChild(pngLink);
                pngLink.click();
                document.body.removeChild(pngLink);
                

                // Exportar SVG separadamente
                const svgEvents = cards.map(card => ({
                    title: card.title,
                    description: card.description,
                    date: card.date,
                    people: card.people
                }));
                
                const svgElement = <EventsGridSVGExport events={svgEvents} paletteType={palette} />;
                const svgString = ReactDOMServer.renderToStaticMarkup(svgElement);
                const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
                const svgUrl = URL.createObjectURL(svgBlob);
                
                const svgLink = document.createElement('a');
                svgLink.download = `grid_${title}_${new Date().toISOString().slice(0, 10)}.svg`;
                svgLink.href = svgUrl;
                document.body.appendChild(svgLink);
                svgLink.click();
                document.body.removeChild(svgLink);
                URL.revokeObjectURL(svgUrl);
                */

                toast.success("Apresentação PowerPoint, imagem PNG e SVG exportadas com sucesso!");
            } else {
                toast.error("A exportação como imagem só está disponível no modo apresentação (Events Grid)");
            }
        } catch (error) {
            console.error("Erro ao exportar PowerPoint:", error);
            toast.error("Erro ao exportar apresentação PowerPoint");
        }
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
        return (
            <div ref={gridRef} id="events-grid-export-area">
                <EventsGridView filteredTasks={filteredTasks} palette={palette} setEditingTask={setEditingTask} />
            </div>
        );
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
                            options={TaskStatusOptions}
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
                                {NextEventsOptions.map((item) => (<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>))}
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
                            <>
                                <Select onValueChange={(value) => setPalette(value as PaletteType)} defaultValue="minsait">
                                    <SelectTrigger className="w-full sm:w-40  text-black"><SelectValue placeholder="Paleta" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="minsait">Minsait</SelectItem>
                                        <SelectItem value="indra">Indra</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button 
                                    onClick={() => setShowPowerPointModal(true)} 
                                    className="flex items-center justify-center bg-[#E3E2DA] hover:bg-[#d6d5cd] p-2 rounded" 
                                    title="Exportar para PowerPoint"
                                >
                                    {/* Ícone PowerPoint SVG */}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect width="24" height="24" rx="4" fill="#D24726"/>
                                      <path d="M7.5 7.5H12.5V16.5H7.5V7.5Z" fill="#fff"/>
                                      <path d="M13.5 7.5C15.9853 7.5 18 9.51472 18 12C18 14.4853 15.9853 16.5 13.5 16.5V7.5Z" fill="#fff"/>
                                      <text x="8.5" y="15.5" font-size="6" fill="#D24726" font-family="Arial" font-weight="bold">P</text>
                                    </svg>
                                </Button>
                            </>
                        )}
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

            <PowerPointExportModal
                isOpen={showPowerPointModal}
                onClose={() => setShowPowerPointModal(false)}
                onExport={handlePowerPointExport}
            />
        </>
    );
};

export default Dashboard;