
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Task, TaskStatus, Stack } from "@/types/task";
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
    status: "Pendente" as TaskStatus,
    stack: (user.role === "user" ? user.stack : "Java") as Stack,
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

    onSubmit(formData);
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
              <Label htmlFor="stack">Stack Tecnológica</Label>
              <Select 
                onValueChange={(value: Stack) => handleInputChange("stack", value)} 
                defaultValue={formData.stack}
                disabled={user.role === "user"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a stack" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Java">Java</SelectItem>
                  <SelectItem value=".NET">.NET</SelectItem>
                  <SelectItem value="PHP">PHP</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="Dados">Dados</SelectItem>
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
                onValueChange={(value: TaskStatus) => handleInputChange("status", value)} 
                defaultValue={formData.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Completo">Completo</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
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
