import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ListValue, Responsible } from "@/types/task";
import { FormEvent } from "react";

interface UserGeneralTabProps {
  formData: {
    name: string;
    email: string;
    role: 'admin' | 'user';
    stack: string;
    active: boolean;
    responsibles: Responsible[];
  };
  setFormData: (updater: (prev: any) => any) => void;
  isEditing: boolean;
  onCancel: () => void;
  onSubmit: (e: FormEvent) => void;
  stack: ListValue[];
}

const UserGeneralTab = ({ formData, setFormData, isEditing, onCancel, onSubmit, stack }: UserGeneralTabProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="name">Nome</Label>
      <Input
        id="name"
        value={formData.name}
        onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData((prev: any) => ({ ...prev, email: e.target.value }))}
        required
        disabled={isEditing}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="role">Função</Label>
      <Select 
        value={formData.role} 
        onValueChange={(value: 'admin' | 'user') => setFormData((prev: any) => ({ ...prev, role: value }))}
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
        onValueChange={(value) => setFormData((prev: any) => ({ ...prev, stack: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione a stack" />
        </SelectTrigger>
        <SelectContent>
          {stack.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
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
          onCheckedChange={(checked) => setFormData((prev: any) => ({ ...prev, active: checked }))}
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
);

export default UserGeneralTab; 