import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect, Option } from "@/components/ui/multi-select";
import { Switch } from "@/components/ui/switch";
import { ListValue, Responsible } from "@/types/task";
import { FormEvent } from "react";
import { RoleOptions } from "@/lib/utils";

interface UserGeneralTabProps {
  formData: {
    name: string;
    email: string;
    role: string;
    stack: string;
    active: boolean;
  };
  setFormData: (updater: (prev: any) => any) => void;
  isEditing: boolean;
  onCancel: () => void;
  onSubmit: (e: FormEvent) => void;
  stack: ListValue[];
}

const UserGeneralTab = ({ formData, setFormData, isEditing, onCancel, onSubmit, stack }: UserGeneralTabProps) => {
  const wSelected = formData.stack?.split(",");
  const setEventTypeFilter = (selectedValues: string[]) => {
    setFormData((prev: any) => ({ ...prev, stack: selectedValues.join(",") }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" value={formData.name} onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData((prev: any) => ({ ...prev, email: e.target.value }))} required disabled={isEditing} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Função</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData((prev: any) => ({ ...prev, role: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a função" />
          </SelectTrigger>
          <SelectContent>
            {RoleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="stack">Comunidade</Label>
        <br/>
        <MultiSelect
          options={stack.map((item) => ({
            label: item.label,
            value: item.value,
          }))}
          selectedValues={wSelected}
          onSelectionChange={setEventTypeFilter}
          placeholder="Selecione a(s) comunidade(s)"
          className="w-full sm:w-40"
          showAllOption={false}
        />
      </div>

      {isEditing && (
        <div className="flex items-center space-x-2">
          <Switch id="active" checked={formData.active} onCheckedChange={(checked) => setFormData((prev: any) => ({ ...prev, active: checked }))} />
          <Label htmlFor="active">Usuário ativo</Label>
        </div>
      )}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{isEditing ? "Atualizar" : "Criar"}</Button>
      </div>
    </form>
  );
};
export default UserGeneralTab;
