import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task, Responsible, Schedule } from "@/types/task";
import { User } from "@/types/auth";
import { toast } from "@/hooks/use-toast";
import { ListValue } from "@/types/task";
import { validateTaskDates, validateDateString, validateDateNotBefore2000 } from "@/lib/date-validation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useVacancies } from "@/hooks/useVacancies";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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
import VacancyForm from "@/components/vacancy/VacancyForm";

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
  const { vacancies, fetchVacancies } = useVacancies();

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
    seniority: -1,
    schedule: [] as Schedule[],
    vacancy: ""
  });

  const [showNewEventTypeModal, setShowNewEventTypeModal] = useState(false);
  const [showNewStackModal, setShowNewStackModal] = useState(false);
  const [showNewDisciplineModal, setShowNewDisciplineModal] = useState(false);

  const [selectedVacancyId, setSelectedVacancyId] = useState<string>("");
  const [vacancyFieldsDisabled, setVacancyFieldsDisabled] = useState(false);
  
  const [showVacancyForm, setShowVacancyForm] = useState(false);

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
        seniority: task.seniority,
        schedule: task.schedule || [],
        vacancy: task.vacancy || ""
      });

      // Verificar se há dados nas abas avançadas para mostrar automaticamente
      const hasResponsibles = task.responsibles && task.responsibles.length > 0;
      const hasDetails = task.student_count > 0 || task.vacancy_count > 0 || task.syllabus || task.seniority;
      const hasSchedule = task.schedule && task.schedule.length > 0;

      setActiveTab("basic");
      if (hasResponsibles || hasDetails || hasSchedule) {
        setShowAdvancedFields(true);
      }
    } else {
      // Para novas tarefas, sempre começar com campos básicos
      setActiveTab("basic");
      setShowAdvancedFields(false);
    }
  }, [task]);

  useEffect(() => {
    fetchVacancies(1, 1000, ""); // Busca todas as vagas (ajuste o pageSize se necessário)
  }, []);

  useEffect(() => {
    if (selectedVacancyId) {
      const selected = vacancies.find(v => v.id === selectedVacancyId);
      if (selected) {
        setFormData(prev => ({
          ...prev,
          vacancy: selected.id,
          seniority: selected.seniority,
        }));
        setVacancyFieldsDisabled(true);
      }
    } else {
      setVacancyFieldsDisabled(false);
    }
  }, [selectedVacancyId, vacancies]);

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

    // Validar datas usando função centralizada
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    
    if (!validateTaskDates(startDate, endDate)) {
      return;
    }

    onSubmit({
      ...formData,
      vacancy: formData.vacancy === "" ? null : formData.vacancy,
      start_date: formData.start_date,
      end_date: formData.end_date,
      event_type: formData.event_type,
    });
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number | Responsible[] | Schedule[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInputDataBlur = (field: 'start_date' | 'end_date', value: string) => {
    // Validar apenas quando o usuário sair do campo
    const isoStringForStorage = `${value}:00.000Z`;
    
    // Basic validation for the input format
    if (!validateDateString(isoStringForStorage)) {
      return;
    }

    // Validar se a data não é anterior ao ano 2000
    const date = new Date(isoStringForStorage);
    if (!validateDateNotBefore2000(date, field === 'start_date' ? 'data de início' : 'data de fim')) {
      return;
    }
  };

  const handleInputDataChange = (field: 'start_date' | 'end_date', value: string) => {
    // The value from datetime-local input is already in YYYY-MM-DDTHH:mm format.
    // We want to treat this local time as if it were UTC for storage.
    // Append seconds and milliseconds and the 'Z' (Zulu/UTC) indicator.
    const isoStringForStorage = `${value}:00.000Z`;

    // Update formData with the ISO string that treats local input as UTC
    setFormData(prev => {
      const newDate = new Date(isoStringForStorage); // This is the UTC date object representing the entered time
      const updatedPrev = { ...prev, [field]: isoStringForStorage };

      // Validar se a data/hora de fim é posterior à data/hora de início
      const currentStartDate = field === 'start_date' ? newDate : new Date(prev.start_date);
      const currentEndDate = field === 'end_date' ? newDate : new Date(prev.end_date);

      if (currentEndDate <= currentStartDate) {
        // Mostrar erro apenas se ambos os campos estiverem preenchidos
        if (prev.start_date && prev.end_date) {
          toast({
            title: "Erro de Data/Hora",
            description: "A data e hora de fim deve ser posterior à data e hora de início.",
            variant: "destructive",
          });
        }
        
        // Auto-adjust logic apenas para start_date
        if (field === 'start_date') {
          // Se a data de início for posterior à data de fim, ajustar automaticamente a data de fim
          const newEndDate = new Date(newDate.getTime() + 60 * 60 * 1000); // Adicionar 1 hora
          const newEndDateTime = newEndDate.toISOString().slice(0, 16);
          setEndDateTime(newEndDateTime);
          updatedPrev.end_date = `${newEndDateTime}:00.000Z`;
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

        <form onSubmit={handleSubmit} className="space-y-4 ">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full min-h-[650px]">
            <div className="">
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
                  onInputDataBlur={handleInputDataBlur}
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
                        vacancies={vacancies}
                        selectedVacancyId={selectedVacancyId}
                        setSelectedVacancyId={setSelectedVacancyId}
                        setShowVacancyForm={setShowVacancyForm}
                        onVacancyChange={(field, value) => {
                          setFormData(prev => ({
                            ...prev,
                          }));
                        }}
                        onInputChange={handleInputChange}
                        fieldsDisabled={vacancyFieldsDisabled}
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

      {showVacancyForm && (
        <Dialog open={showVacancyForm} onOpenChange={setShowVacancyForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Vaga</DialogTitle>
            </DialogHeader>
            <VacancyForm
              onSubmit={() => setShowVacancyForm(false)}
              onCancel={() => setShowVacancyForm(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default TaskForm;