import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Task, Responsible, ListValue } from "@/types/task";
import { TaskStatusOptions, OriginOptions } from '@/lib/utils';

interface TaskBasicTabProps {
  formData: {
    title: string;
    subtitle: string;
    description: string;
    responsible: string;
    start_date: string;
    end_date: string;
    hours: number;
    people: number;
    status: string;
    stack: string;
    event_type: string;
    origin: number;
    summary: string;
  };
  startDateTime: string;
  endDateTime: string;
  stack: ListValue[];
  eventType: ListValue[];
  onInputChange: (field: keyof Task, value: string | number) => void;
  onInputDataChange: (field: 'start_date' | 'end_date', value: string) => void;
  onInputDataBlur: (field: 'start_date' | 'end_date', value: string) => void;
  onShowNewStackModal: () => void;
  onShowNewEventTypeModal: () => void;
}

const TaskBasicTab = ({
  formData,
  startDateTime,
  endDateTime,
  stack,
  eventType,
  onInputChange,
  onInputDataChange,
  onInputDataBlur,
  onShowNewStackModal,
  onShowNewEventTypeModal
}: TaskBasicTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 flex flex-col justify-end h-full">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onInputChange("title", e.target.value)}
            placeholder="Digite o título da tarefa"
            required
          />
        </div>
        <div className="md:col-span-2 flex flex-row gap-2 items-end">
          <div className="flex-1 flex flex-col">
            <Label htmlFor="subtitle">Tags</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => onInputChange("subtitle", e.target.value)}
              placeholder="Ex: #Jornada Cloud, #Aculturamento de IA "
            />
          </div>
          <div className="w-64 flex flex-col">
            <Label htmlFor="origin">Origem</Label>
            <Select
              value={formData.origin !== undefined && formData.origin !== null ? formData.origin.toString() : ""}
              onValueChange={(value) => onInputChange("origin", value === "" ? null : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a origem" />
              </SelectTrigger>
              <SelectContent>
                {OriginOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-col justify-end h-full">
          <Label htmlFor="description">Resumo *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            placeholder="Descreva a tarefa em detalhes"
            rows={6}
          />
        </div>
        <div className="md:col-span-2 flex flex-col justify-end h-full">
          <Label htmlFor="summary">Resumo Adicional</Label>
          <Textarea
            id="summary"
            value={formData.summary}
            onChange={(e) => onInputChange("summary", e.target.value)}
            placeholder="Resumo adicional da tarefa (texto da visão de apresentação, se não estiver preenchido o campo resumo será mostrado) (opcional)"
            rows={3}
          />
        </div>
        
        <div className="flex flex-col justify-end h-full">
          <Label htmlFor="responsible">Responsável *</Label>
          <Input
            id="responsible"
            value={formData.responsible}
            onChange={(e) => onInputChange("responsible", e.target.value)}
            placeholder="Nome do responsável"
            required
          />
        </div>
        
        <div className="flex items-end gap-2 h-full">
          <div className="flex-1 flex flex-col justify-end h-full">
            <Label htmlFor="stack">Comunidade *</Label>
            <Select 
              onValueChange={(value) => onInputChange("stack", value)} 
              value={formData.stack || ""}                
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
          <Button type="button" variant="outline" size="icon" onClick={onShowNewStackModal}>
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
            onChange={(e) => onInputDataChange("start_date", e.target.value)}
            onBlur={(e) => onInputDataBlur("start_date", e.target.value)}
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
            onChange={(e) => onInputDataChange("end_date", e.target.value)}
            onBlur={(e) => onInputDataBlur("end_date", e.target.value)}
            required
          />
        </div>
        
        <div className="flex flex-col justify-end h-full">
          <Label htmlFor="hours">Horas Estimadas</Label>
          <Input
            id="hours"
            type="number"
            min="0"
            value={formData.hours || 0}
            onChange={(e) => onInputChange("hours", parseInt(e.target.value) || 0)}
            placeholder="Ex: 40"
          />
        </div>
        
        <div className="flex flex-col justify-end h-full">
          <Label htmlFor="people">Número de Participantes</Label>
          <Input
            id="people"
            type="number"
            min="0"
            value={formData.people || 0}
            onChange={(e) => onInputChange("people", parseInt(e.target.value) || 0)}
            placeholder="Ex: 2"
          />
        </div>
        
        <div className="flex flex-col justify-end h-full">
          <Label htmlFor="status">Status *</Label>
          <Select 
            onValueChange={(value) => onInputChange("status", value)} 
            value={formData.status || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              {TaskStatusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end gap-2 h-full">
          <div className="flex-1 flex flex-col justify-end h-full">
            <Label htmlFor="event_type">Tipo de Evento *</Label>
            <Select 
              onValueChange={(value) => onInputChange("event_type", value)} 
              value={formData.event_type || ""}
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
          <Button type="button" variant="outline" size="icon" onClick={onShowNewEventTypeModal}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskBasicTab; 