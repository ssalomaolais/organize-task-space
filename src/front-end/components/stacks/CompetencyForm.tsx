import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SeniorityOptions } from "@/lib/utils";

export interface CompetencyFormValues {
  name: string;
  minGrade: number;
  seniority: number;
}

interface CompetencyFormProps {
  initialValue?: CompetencyFormValues;
  onSubmit: (values: CompetencyFormValues) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const CompetencyForm: React.FC<CompetencyFormProps> = ({ initialValue, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = useState<CompetencyFormValues>({
    name: "",
    minGrade: 0,
    seniority: -1,
  });

  useEffect(() => {
    if (initialValue) setFormData(initialValue);
  }, [initialValue]);

  const handleAddOrUpdate = () => {
    if (!formData.name.trim() || formData.seniority === -1) return;
    onSubmit(formData);
    setFormData({ name: "", minGrade: 0, seniority: -1 });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="competency-seniority">Senioridade *</Label>
          <select
            id="competency-seniority"
            className="w-full border rounded px-2 py-1"
            value={formData.seniority}
            onChange={e => setFormData({ ...formData, seniority: Number(e.target.value) })}
          >
            <option value={-1}>Selecione...</option>
            {SeniorityOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="competency-name">Nome *</Label>
          <Input
            id="competency-name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nome da competência"
            autoFocus
          />
        </div>
        <div>
          <Label htmlFor="competency-minGrade">Nota mínima *</Label>
          <Input
            id="competency-minGrade"
            type="number"
            min={0}
            max={10}
            value={formData.minGrade}
            onChange={e => setFormData({ ...formData, minGrade: Number(e.target.value) })}
            placeholder="Nota mínima"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={handleAddOrUpdate}
          disabled={!formData.name || formData.seniority === -1}
        >
          {isEditing ? "Atualizar" : "Adicionar"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default CompetencyForm; 