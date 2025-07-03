import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListValue } from "@/types/task";
import { TailwindColors } from "@/lib/utils";

interface EventTypeFormProps {
  eventType?: ListValue | null;
  onSubmit: (eventTypeData: Omit<ListValue, 'id'>) => void;
  onCancel: () => void;
}

const EventTypeForm = ({ eventType, onSubmit, onCancel }: EventTypeFormProps) => {
  const [formData, setFormData] = useState({
    value: '',
    label: '',
    color: TailwindColors[0].value // Default to the first color
  });

  useEffect(() => {
    if (eventType) {
      setFormData({
        value: eventType.value,
        label: eventType.label,
        color: eventType.color || TailwindColors[0].value // Fallback to default if color is missing
      });
    }
  }, [eventType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!eventType;

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Tipo de Evento' : 'Novo Tipo de Evento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Nome do Tipo de Evento</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Identificador (único)</Label>
            <Input
              id="value"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              required
              disabled={isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Cor</Label>
            <Select
              value={formData.color}
              onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma cor" />
              </SelectTrigger>
              <SelectContent>
                {TailwindColors.map((colorOption) => (
                  <SelectItem key={colorOption.value} value={colorOption.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${colorOption.preview}`}></div>
                      <span>{colorOption.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Atualizar' : 'Criar'} Tipo de Evento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventTypeForm;