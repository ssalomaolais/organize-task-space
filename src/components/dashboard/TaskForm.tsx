import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Task } from "@/types/task";
import { TaskStatus } from '@/lib/utils';
import { User } from "@/types/auth";
import { toast } from "@/hooks/use-toast";
import { ListValue } from "@/types/task";
import { Plus } from "lucide-react";

import EventTypeForm from "@/components/event_types/EventTypeForm";
import StackForm from "@/components/stacks/StackForm";
import { useEventType } from "@/hooks/useEventType";
import { useStack } from "@/hooks/useStack";

interface TaskFormProps {
  task?: Task | null;
  stack: ListValue[] | [];
  eventType: ListValue[] | [];
  user: User;
  onSubmit: (taskData: Omit<Task, "id" | "created_at" | "updated_at" | "user_id">) => void;
  onDelete: (taskId: string) => void;
  onCancel: () => void;
}

const TaskForm = ({ task, user, stack, eventType, onSubmit, onCancel, onDelete }: TaskFormProps) => {
  const { createEventType, fetchEventType } = useEventType();
  const { createStack, fetchStack } = useStack();

  const [startDateTime, setStartDateTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [endDateTime, setEndDateTime] = useState(
    new Date().toISOString().slice(0, 16)
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    responsible: "",
    start_date: startDateTime,
    end_date: endDateTime,
    hours: 0,
    people: 0,
    status: "Pendente",
    stack: (user.role === "user" ? user.stack : "Java"),
    event_type: "Outros",
  });

  const [showNewEventTypeModal, setShowNewEventTypeModal] = useState(false);
  const [showNewStackModal, setShowNewStackModal] = useState(false);

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
        title: task.title,
        description: task.description,
        responsible: task.responsible,
        start_date: task.start_date, // Keep the full ISO string for formData
        end_date: task.end_date,     // Keep the full ISO string for formData
        hours: task.hours,
        people: task.people,
        status: task.status,
        stack: task.stack,
        event_type: task.event_type || "Outros",
      });
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

  const handleInputChange = (field: keyof typeof formData, value: any) => {
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
      let updatedPrev = { ...prev, [field]: isoStringForStorage };

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

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {task ? "Editar Tarefa" : "Nova Tarefa"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 flex flex-col justify-end h-full">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Digite o título da tarefa"
                required
              />
            </div>
            
            <div className="md:col-span-2 flex flex-col justify-end h-full">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descreva a tarefa em detalhes"
                rows={3}                
              />
            </div>
            
            <div className="flex flex-col justify-end h-full">
              <Label htmlFor="responsible">Responsável *</Label>
              <Input
                id="responsible"
                value={formData.responsible}
                onChange={(e) => handleInputChange("responsible", e.target.value)}
                placeholder="Nome do responsável"
                required
              />
            </div>
            
            <div className="flex items-end gap-2 h-full">
              <div className="flex-1 flex flex-col justify-end h-full">
                <Label htmlFor="stack">Comunidade</Label>
                <Select 
                  onValueChange={(value) => handleInputChange("stack", value)} 
                  value={formData.stack}                
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a stack" />
                  </SelectTrigger>
                  <SelectContent>
                    {stack.map((stack) => (
                      <SelectItem key={stack.value} value={stack.value}>
                        {stack.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" variant="outline" size="icon" onClick={() => setShowNewStackModal(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-col justify-end h-full">
              <Label htmlFor="start_date">Data e Hora de Início *</Label>
              <Input
                type="datetime-local"
                className="form-control"
                id="startDateTime"
                name="startDateTime"
                value={startDateTime}
                onChange={(e) => handleInputDataChange("start_date", e.target.value)}
                required
              />              
            </div>
            
            <div className="flex flex-col justify-end h-full">
              <Label htmlFor="end_date">Data e Hora Fim * </Label>
              <Input
                type="datetime-local"
                className="form-control"
                id="end_date"
                value={endDateTime}
                onChange={(e) => handleInputDataChange("end_date", e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col justify-end h-full">
              <Label htmlFor="hours">Horas Estimadas</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                value={formData.hours}
                onChange={(e) => handleInputChange("hours", parseInt(e.target.value) || 0)}
                placeholder="Ex: 40"
              />
            </div>
            
            <div className="flex flex-col justify-end h-full">
              <Label htmlFor="people">Número de Pessoas</Label>
              <Input
                id="people"
                type="number"
                min="0"
                value={formData.people}
                onChange={(e) => handleInputChange("people", parseInt(e.target.value) || 0)}
                placeholder="Ex: 2"
              />
            </div>
            
            <div className="flex flex-col justify-end h-full">
              <Label htmlFor="status">Status</Label>
              <Select 
                onValueChange={(value) => handleInputChange("status", value)} 
                value={formData.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {TaskStatus.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end gap-2 h-full">
              <div className="flex-1 flex flex-col justify-end h-full">
                <Label htmlFor="event_type">Tipo de Evento</Label>
                <Select 
                  onValueChange={(value) => handleInputChange("event_type", value)} 
                  value={formData.event_type}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de evento" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventType.map((item2) => (
                      <SelectItem key={item2.value} value={item2.value}>
                        {item2.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" variant="outline" size="icon" onClick={() => setShowNewEventTypeModal(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => task && onDelete(task.id)}
              disabled={!task}
            >
               Excluir
            </Button>
            <Button type="submit">
              {task ? "Atualizar" : "Criar"} Tarefa
            </Button>
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
    </Dialog>
  );
};

export default TaskForm;