import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Schedule, Responsible } from "@/types/task";
import { Plus, Edit, Trash2, Clock, User, Calendar, ArrowRight, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getDayLabel, DaysOfWeek, TimeSlots } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
interface TaskScheduleTabProps {
  schedule: Schedule[];
  responsibles: Responsible[];
  onScheduleChange: (schedule: Schedule[]) => void;
}

const TaskScheduleTab = ({ schedule, responsibles, onScheduleChange }: TaskScheduleTabProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    day: "",
    timeStart: "",
    timeEnd: "",
    instructor: ""
  });

  const handleAdd = () => {
    if (!formData.day || !formData.timeStart || !formData.timeEnd || !formData.instructor) {
      return;
    }

    // Validar se o horário de fim é posterior ao horário de início
    if (formData.timeEnd <= formData.timeStart) {
      toast({
        title: "Erro de Horário",
        description: "O horário de fim deve ser posterior ao horário de início.",
        variant: "destructive",
      });
      return;
    }

    const newSchedule: Schedule = {
      id: Date.now().toString(),
      day: formData.day,
      timeStart: formData.timeStart,
      timeEnd: formData.timeEnd,
      instructor: formData.instructor
    };

    onScheduleChange([...schedule, newSchedule]);
    setFormData({ day: "", timeStart: "", timeEnd: "", instructor: "" });
    setIsAdding(false);
  };

  const handleEdit = (id: string) => {
    const item = schedule.find(s => s.id === id);
    if (item) {
      setFormData({
        day: item.day,
        timeStart: item.timeStart,
        timeEnd: item.timeEnd,
        instructor: item.instructor
      });
      setEditingId(id);
      setIsAdding(true);
    }
  };

  const handleUpdate = () => {
    if (!formData.day || !formData.timeStart || !formData.timeEnd || !formData.instructor || !editingId) {
      return;
    }

    // Validar se o horário de fim é posterior ao horário de início
    if (formData.timeEnd <= formData.timeStart) {
      toast({
        title: "Erro de Horário",
        description: "O horário de fim deve ser posterior ao horário de início.",
        variant: "destructive",
      });
      return;
    }

    const updatedSchedule = schedule.map(s =>
      s.id === editingId
        ? { ...s, day: formData.day, timeStart: formData.timeStart, timeEnd: formData.timeEnd, instructor: formData.instructor }
        : s
    );

    onScheduleChange(updatedSchedule);
    setFormData({ day: "", timeStart: "", timeEnd: "", instructor: "" });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const updatedSchedule = schedule.filter(s => s.id !== id);
    onScheduleChange(updatedSchedule);
  };

  const handleCancel = () => {
    setFormData({ day: "", timeStart: "", timeEnd: "", instructor: "" });
    setEditingId(null);
    setIsAdding(false);
  };


  const getInstructorName = (instructorId: string) => {
    return responsibles.find(r => r.id === instructorId)?.name || instructorId;
  };

  const getInstructorInfo = (instructorId: string) => {
    return responsibles.find(r => r.id === instructorId);
  };

  return (
    <div className="space-y-4 min-h-[400px]">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Grade de Horário</h3>
        {!isAdding && (
          <Button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Horário
          </Button>
        )}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {editingId ? "Editar Horário" : "Adicionar Horário"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <Label htmlFor="day">Dia da Semana</Label>
                <Select
                  value={formData.day}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, day: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {DaysOfWeek.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="timeStart">Início</Label>
                <Select
                  value={formData.timeStart}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, timeStart: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Início" />
                  </SelectTrigger>
                  <SelectContent>
                    {TimeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="timeEnd">Fim</Label>
                <Select
                  value={formData.timeEnd}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, timeEnd: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Fim" />
                  </SelectTrigger>
                  <SelectContent>
                    {TimeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="instructor">Instrutor</Label>
                <Select
                  value={formData.instructor}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, instructor: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o instrutor" />
                  </SelectTrigger>
                  <SelectContent>
                    {responsibles.map((responsible) => (
                      <SelectItem key={responsible.id} value={responsible.id}>
                        {responsible.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={editingId ? handleUpdate : handleAdd}
                disabled={!formData.day || !formData.timeStart || !formData.timeEnd || !formData.instructor}
              >
                {editingId ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {schedule.length === 0 && !isAdding ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mb-4 opacity-50" />
            <p>Nenhum horário configurado</p>
            <p className="text-sm">Clique em "Adicionar Horário" para começar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedule.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <Badge variant="secondary">
                      {getDayLabel(item.day)}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item.id)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{item.timeStart} <ArrowRight className="inline h-4 w-4 mx-1 text-muted-foreground" /> {item.timeEnd}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-muted-foreground">
                      {getInstructorName(item.instructor)}
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                          >
                            <Info className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div className="space-y-2">
                            <div>
                              <strong>Instrutor:</strong> {getInstructorName(item.instructor)}
                            </div>
                            {getInstructorInfo(item.instructor)?.discipline && (
                              <div>
                                <strong>Disciplina:</strong> {getInstructorInfo(item.instructor)?.discipline}
                              </div>
                            )}
                            {getInstructorInfo(item.instructor)?.syllabus && (
                              <div>
                                <strong>Ementa:</strong>
                                <p className="text-xs mt-1">{getInstructorInfo(item.instructor)?.syllabus}</p>
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskScheduleTab; 