
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Profile } from "@/types/auth";

interface UserFormProps {
  user?: Profile | null;
  onSubmit: (userData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

//const STACKS: Stack[] = ['Java', 'Python', 'JavaScript', 'React', 'Angular', 'Vue', 'Node.js', 'PHP', 'C#', '.NET'];

const UserForm = ({ user, onSubmit, onCancel }: UserFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user',
    stack: '',
    active: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        stack: user.stack || '',
        active: user.active ?? true
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!user;

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              disabled={isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Função</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value: 'admin' | 'user') => setFormData(prev => ({ ...prev, role: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuário</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stack">Stack</Label>
            <Select 
              value={formData.stack} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, stack: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a stack" />
              </SelectTrigger>
              <SelectContent>
                {STACKS.map((stack) => (
                  <SelectItem key={stack} value={stack}>
                    {stack}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isEditing && (
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
              />
              <Label htmlFor="active">Usuário ativo</Label>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Atualizar' : 'Criar'} Usuário
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
