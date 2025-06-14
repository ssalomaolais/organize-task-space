
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Task, EventType } from "@/types/task";
import { TaskStatus, Stacks } from '@/lib/utils';
import { User } from "@/types/auth";
import { toast } from "@/hooks/use-toast";

interface TaskFormProps {
  task?: Task | null;
  user: User;
  onSubmit: (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

const TaskForm = ({ task, user, onSubmit, onCancel }: TaskFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    responsible: "",
    startDate: "",
    endDate: "",
    hours: 0,
    people: 1,
    status: "Pendente",
    stack: (user.role === "user" ? user.stack : "Java"),
    eventType: "Outros" as EventType,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        responsible: task.responsible,
        startDate: task.startDate,
        endDate: task.endDate,
        hours: task.hours,
        people: task.people,
        status: task.status,
        stack: task.stack,
        eventType: task.eventType || "Outros",
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

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast({
        title: "Erro",
        description: "A data de fim deve ser posterior à data de início.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      ...formData,
      startDate: formData.startDate,
      endDate: formData.endDate,
      eventType: formData.eventType,
    });
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            <div className="md:col-span-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Digite o título da tarefa"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descreva a tarefa em detalhes"
                rows={3}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="responsible">Responsável *</Label>
              <Input
                id="responsible"
                value={formData.responsible}
                onChange={(e) => handleInputChange("responsible", e.target.value)}
                placeholder="Nome do responsável"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="stack">Comunidade</Label>
              <Select 
                onValueChange={(value) => handleInputChange("stack", value)} 
                defaultValue={formData.stack}                
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a stack" />
                </SelectTrigger>
                <SelectContent>
                  {Stacks.filter((t) => t.value !== "all").map((stack) => (
                    <SelectItem key={stack.value} value={stack.value}>
                      {stack.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="startDate">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="endDate">Data de Fim</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                required
              />
            </div>
            
            <div>
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
            
            <div>
              <Label htmlFor="people">Número de Pessoas</Label>
              <Input
                id="people"
                type="number"
                min="1"
                value={formData.people}
                onChange={(e) => handleInputChange("people", parseInt(e.target.value) || 1)}
                placeholder="Ex: 2"
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                onValueChange={(value) => handleInputChange("status", value)} 
                defaultValue={formData.status}
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
            
            <div>
              <Label htmlFor="eventType">Tipo de Evento</Label>
              <Select 
                onValueChange={(value: EventType) => handleInputChange("eventType", value)} 
                defaultValue={formData.eventType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Forum Técnico">Forum Técnico</SelectItem>
                  <SelectItem value="Meetup Interno">Meetup Interno</SelectItem>
                  <SelectItem value="Meetup Externo">Meetup Externo</SelectItem>
                  <SelectItem value="Techup Interno">Techup Interno</SelectItem>
                  <SelectItem value="Techup Externo">Techup Externo</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {task ? "Atualizar" : "Criar"} Tarefa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
