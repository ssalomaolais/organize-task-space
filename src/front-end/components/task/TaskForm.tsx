import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task, Responsible, Schedule } from "@/types/task";
import { User } from "@/types/auth";
import { toast } from "@/hooks/use-toast";
import { ListValue } from "@/types/task";
import { ChevronDown, ChevronUp } from "lucide-react";

import EventTypeForm from "@/components/event_types/EventTypeForm";
import StackForm from "@/components/stacks/StackForm";
import DisciplineForm from "@/components/disciplines/DisciplineForm";
import TaskBasicTab from "./TaskBasicTab";
import TaskResponsiblesTab from "./TaskResponsiblesTab";
import TaskDetailsTab from "./TaskDetailsTab";
import TaskScheduleTab from "./TaskScheduleTab";
import { useEventType } from "@/hooks/useEventType";
import { useStack } from "@/hooks/useStack";
import { useDiscipline } from "@/hooks/useDiscipline";
import TaskVagaTab from "./TaskVagaTab";

interface TaskFormProps {
  task?: Task | null;
  stack: ListValue[];
  eventType: ListValue[];
  user: User;
  onSubmit: (taskData: Omit<Task, "id" | "created_at" | "updated_at" | "user_id">) => void;
  onDelete: (taskId: string) => void;
  onCancel: () => void;
}

const TaskForm = ({ task, user, stack, eventType, onSubmit, onCancel, onDelete }: TaskFormProps) => {
  const { createEventType, fetchEventType } = useEventType();
  const { createStack, fetchStack } = useStack();
  const { createDiscipline, fetchDiscipline } = useDiscipline();

  const [startDateTime, setStartDateTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [endDateTime, setEndDateTime] = useState(
    new Date().toISOString().slice(0, 16)
  );

  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    responsible: "",
    start_date: startDateTime,
    end_date: endDateTime,
    hours: 0,
    people: 0,
    status: "Pendente",
    stack: (user.role === "user" ? user.stack : "Java"),
    event_type: "Outros",
    // Campos adicionais
    responsibles: [] as Responsible[],
    student_count: 0,
    vacancy_count: 0,
    syllabus: "",
    seniority: "",
    schedule: [] as Schedule[],
    vacancy: { teams: "", dayToDay: "", regime: "offsite" as "offsite" | "hybrid", gupyLink: "", knowledges: [] as any[] },
  });

  const [showNewEventTypeModal, setShowNewEventTypeModal] = useState(false);
  const [showNewStackModal, setShowNewStackModal] = useState(false);
  const [showNewDisciplineModal, setShowNewDisciplineModal] = useState(false);

  useEffect(() => {
    if (task) {
      // When loading an existing task, assume the stored ISO string is the exact time
      // we want to display in the datetime-local input.
      // Slice it to YYYY-MM-DDTHH:mm format.
      const formattedStartDate = task.start_date ? task.start_date.slice(0, 16) : ''
      const formattedEndDate = task.end_date ? task.end_date.slice(0, 16) : ''
      setStartDateTime(formattedStartDate);
      setEndDateTime(formattedEndDate);

      setFormData({
        title: task.title || "",
        subtitle: task.subtitle || "",
        description: task.description || "",
        responsible: task.responsible || "",
        start_date: task.start_date || startDateTime, // Keep the full ISO string for formData
        end_date: task.end_date || endDateTime,     // Keep the full ISO string for formData
        hours: task.hours || 0,
        people: task.people || 0,
        status: task.status || "Pendente",
        stack: task.stack || (user.role === "user" ? user.stack : "Java"),
        event_type: task.event_type || "Outros",
        // Campos adicionais
        responsibles: task.responsibles || [],
        student_count: task.student_count || 0,
        vacancy_count: task.vacancy_count || 0,
        syllabus: task.syllabus || "",
        seniority: task.seniority || "",
        schedule: task.schedule || [],
        vacancy: task.vacancy || { teams: "", dayToDay: "", regime: "offsite" as "offsite" | "hybrid", gupyLink: "", knowledges: [] as any[] },
      });

      // Verificar se há dados nas abas avançadas para mostrar automaticamente
      const hasResponsibles = task.responsibles && task.responsibles.length > 0;
      const hasDetails = task.student_count > 0 || task.vacancy_count > 0 || task.syllabus || task.seniority;
      const hasSchedule = task.schedule && task.schedule.length > 0;

      if (hasResponsibles || hasDetails || hasSchedule) {
        setShowAdvancedFields(true);
        // Definir a aba ativa baseada nos dados disponíveis
        if (hasResponsibles && (hasDetails || hasSchedule)) {
          setActiveTab("responsibles"); // Prioriza responsáveis se existem
        } else if (hasResponsibles) {
          setActiveTab("responsibles");
        } else if (hasDetails) {
          setActiveTab("details");
        } else if (hasSchedule) {
          setActiveTab("schedule");
        }
      } else {
        // Se não há dados avançados, sempre mostrar campos básicos
        setActiveTab("basic");
      }
    } else {
      // Para novas tarefas, sempre começar com campos básicos
      setActiveTab("basic");
      setShowAdvancedFields(false);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.responsible) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      toast({
        title: "Erro",
        description: "A data de fim deve ser posterior à data de início.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      ...formData,
      start_date: formData.start_date,
      end_date: formData.end_date,
      event_type: formData.event_type,
    });
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number | Responsible[] | Schedule[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInputDataChange = (field: 'start_date' | 'end_date', value: string) => {
    // The value from datetime-local input is already in YYYY-MM-DDTHH:mm format.
    // We want to treat this local time as if it were UTC for storage.
    // Append seconds and milliseconds and the 'Z' (Zulu/UTC) indicator.
    const isoStringForStorage = `${value}:00.000Z`;

    // Basic validation for the input format
    const date = new Date(isoStringForStorage); // This will parse it as UTC
    if (isNaN(date.getTime())) {
      toast({
        title: "Erro de Data",
        description: "Formato de data/hora inválido. Por favor, use o formato AAAA-MM-DDTHH:mm.",
        variant: "destructive",
      });
      return;
    }

    // Update formData with the ISO string that treats local input as UTC
    setFormData(prev => {
      const newDate = date; // This is the UTC date object representing the entered time
      const updatedPrev = { ...prev, [field]: isoStringForStorage };

      // Auto-adjust logic
      const currentStartDate = field === 'start_date' ? newDate : new Date(prev.start_date);
      const currentEndDate = field === 'end_date' ? newDate : new Date(prev.end_date);

      if (currentEndDate < currentStartDate) {
        if (field === 'start_date') {
          // If start date is set after end date, update end date to match start date
          setEndDateTime(value); // Update end date input field
          updatedPrev.end_date = isoStringForStorage; // Update end date in formData
        } else { // field === 'end_date'
          // If end date is set before start date, update start date to match end date
          setStartDateTime(value); // Update start date input field
          updatedPrev.start_date = isoStringForStorage; // Update start date in formData
        }
      }
      return updatedPrev;
    });

    // Update the local state for the input field to reflect the exact value entered
    if (field === 'start_date') {
      setStartDateTime(value);
    } else {
      setEndDateTime(value);
    }
  };

  const handleNewEventTypeSubmit = async (newEventTypeData: Omit<ListValue, 'id'>) => {
    const result = await createEventType(newEventTypeData);
    if (result.data) {
      await fetchEventType(); // Refresh event types in the dropdown
      setFormData(prev => ({ ...prev, event_type: result.data!.value })); // Select the new type
      setShowNewEventTypeModal(false);
    }
  };

  const handleNewStackSubmit = async (newStackData: Omit<ListValue, 'id'>) => {
    const result = await createStack(newStackData);
    if (result.data) {
      await fetchStack(); // Refresh stacks in the dropdown
      setFormData(prev => ({ ...prev, stack: result.data!.value })); // Select the new stack
      setShowNewStackModal(false);
    }
  };

  const handleNewDisciplineSubmit = async (newDisciplineData: Omit<ListValue, 'id'>) => {
    const result = await createDiscipline(newDisciplineData);
    if (result.data) {
      await fetchDiscipline(); // Refresh disciplines in the dropdown
      setShowNewDisciplineModal(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleToggleAdvancedFields = () => {
    if (showAdvancedFields) {
      // Se está ocultando os campos avançados, sempre volta para a aba "basic"
      setActiveTab("basic");
    }
    setShowAdvancedFields(!showAdvancedFields);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className={`${showAdvancedFields ? 'max-w-6xl' : 'max-w-2xl'} max-h-[90vh] overflow-y-auto transition-all duration-300`}>
        <DialogHeader>
          <DialogTitle>
            {task ? "Editar Tarefa" : "Nova Tarefa"}
          </DialogTitle>
          <DialogDescription>
            {task
              ? "Modifique os detalhes da tarefa. Todos os campos obrigatórios devem ser preenchidos."
              : "Preencha os detalhes da nova tarefa. Todos os campos obrigatórios devem ser preenchidos."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="min-h-[600px]">
              {showAdvancedFields && (
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Principal</TabsTrigger>
                  <TabsTrigger value="responsibles">Responsáveis</TabsTrigger>
                  {formData.event_type === 'ET' ? (
                    <TabsTrigger value="vaga">Vaga</TabsTrigger>

                  ) : ((formData.event_type === 'JP' || formData.event_type === 'CT') && (
                    <>
                      <TabsTrigger value="details">Detalhes</TabsTrigger>
                      <TabsTrigger value="schedule">Grade de Horário</TabsTrigger>
                    </>
                  ))}
                </TabsList>
              )}

              <TabsContent value="basic">
                <TaskBasicTab
                  formData={formData}
                  startDateTime={startDateTime}
                  endDateTime={endDateTime}
                  stack={stack}
                  eventType={eventType}
                  onInputChange={handleInputChange}
                  onInputDataChange={handleInputDataChange}
                  onShowNewStackModal={() => setShowNewStackModal(true)}
                  onShowNewEventTypeModal={() => setShowNewEventTypeModal(true)}
                />
              </TabsContent>

              {showAdvancedFields && (
                <>
                  <TabsContent value="responsibles">
                    <TaskResponsiblesTab
                      responsibles={formData.responsibles}
                      onResponsiblesChange={(responsibles) => handleInputChange("responsibles", responsibles)}
                    />
                  </TabsContent>
                  {formData.event_type !== 'ET' ? (
                    <>
                      <TabsContent value="details">
                        <TaskDetailsTab
                          formData={formData}
                          onInputChange={handleInputChange}
                        />
                      </TabsContent>
                      <TabsContent value="schedule">
                        <TaskScheduleTab
                          schedule={formData.schedule}
                          responsibles={formData.responsibles}
                          onScheduleChange={(schedule) => handleInputChange("schedule", schedule)}
                        />
                      </TabsContent>
                    </>
                  ) : (
                    <TabsContent value="vaga">
                      <TaskVagaTab
                        formData={formData}
                        vacancy={formData.vacancy || { teams: "", dayToDay: "", regime: "offsite" as "offsite" | "hybrid", gupyLink: "", knowledges: [] as any[] }}
                        onVacancyChange={(field, value) => {
                          setFormData(prev => ({
                            ...prev,
                            vacancy: {
                              ...prev.vacancy,
                              [field]: value,
                            },
                          }));
                        }}
                        syllabus={formData.syllabus}
                        seniority={formData.seniority}
                        onInputChange={handleInputChange}
                      />
                    </TabsContent>
                  )}
                </>
              )}
            </div>
          </Tabs>

          <div className="flex gap-2 justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleToggleAdvancedFields}
              className="flex items-center gap-2"
            >
              {showAdvancedFields ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Menos...
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Mais...
                </>
              )}
            </Button>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              {task && (<Button
                type="button"
                variant="outline"
                onClick={() => task && onDelete(task.id)}
                disabled={!task}
              >
                Excluir
              </Button>)}
              <Button type="submit">
                {task ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>

      {showNewEventTypeModal && (
        <EventTypeForm
          onSubmit={handleNewEventTypeSubmit}
          onCancel={() => setShowNewEventTypeModal(false)}
        />
      )}

      {showNewStackModal && (
        <StackForm
          onSubmit={handleNewStackSubmit}
          onCancel={() => setShowNewStackModal(false)}
        />
      )}

      {showNewDisciplineModal && (
        <DisciplineForm
          onSubmit={handleNewDisciplineSubmit}
          onCancel={() => setShowNewDisciplineModal(false)}
        />
      )}
    </Dialog>
  );
};

export default TaskForm;