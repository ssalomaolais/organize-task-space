import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ListValue } from "@/types/task";

interface StackFormProps {
  stack?: ListValue | null;
  onSubmit: (stackData: Omit<ListValue, 'id'>) => void;
  onCancel: () => void;
}

const StackForm = ({ stack, onSubmit, onCancel }: StackFormProps) => {
  const [formData, setFormData] = useState({
    value: '',
    label: '',
    color: '#000000'
  });

  useEffect(() => {
    if (stack) {
      setFormData({
        value: stack.value,
        label: stack.label,
        color: stack.color || '#000000'
      });
    }
  }, [stack]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!stack;

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Comunidade' : 'Nova Comunidade'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Nome da Comunidade</Label>
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
            <Input
              id="color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Atualizar' : 'Criar'} Comunidade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StackForm;