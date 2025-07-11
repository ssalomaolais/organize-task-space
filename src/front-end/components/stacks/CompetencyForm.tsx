import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SeniorityOptions } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDiscipline } from "@/hooks/useDiscipline";
import DisciplineForm from "@/components/disciplines/DisciplineForm";

export interface CompetencyFormValues {
  name: string;
  minGrade: number;
  seniority: number;
  discipline: string;
}

interface CompetencyFormProps {
  initialValue?: CompetencyFormValues;
  onSubmit: (values: CompetencyFormValues) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const CompetencyForm: React.FC<CompetencyFormProps> = ({ initialValue, onSubmit, onCancel, isEditing }) => {
  const { discipline, createDiscipline, fetchDiscipline } = useDiscipline();
  const [formData, setFormData] = useState<CompetencyFormValues>({
    name: "",
    minGrade: 0,
    seniority: -1,
    discipline: "",
  });
  const [showNewDisciplineModal, setShowNewDisciplineModal] = useState(false);

  useEffect(() => {
    if (initialValue) {
      console.log('CompetencyForm initialValue:', initialValue);
      setFormData({
        name: initialValue.name || "",
        minGrade: initialValue.minGrade ?? 0,
        seniority: initialValue.seniority ?? -1,
        discipline: initialValue.discipline || "",
      });
    }
  }, [initialValue]);

  useEffect(() => {
    console.log('CompetencyForm formData:', formData);
  }, [formData]);

  const handleAddOrUpdate = () => {
    if (!formData.name.trim() || formData.seniority === -1 || !formData.discipline.trim()) return;
    onSubmit(formData);
    setFormData({ name: "", minGrade: 0, seniority: -1, discipline: "" });
  };

  const handleNewDisciplineSubmit = async (newDisciplineData: Omit<{ value: string; label: string; color?: string }, 'id'>) => {
    const result = await createDiscipline(newDisciplineData);
    if (result.data) {
      await fetchDiscipline();
      setFormData(prev => ({ ...prev, discipline: result.data.value }));
      setShowNewDisciplineModal(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <div className="flex items-end gap-2 h-full">
          <div className="flex-1 flex flex-col justify-end h-full">
            <Label htmlFor="competency-discipline">Disciplina *</Label>
            <Select
              value={formData.discipline}
              onValueChange={value => setFormData({ ...formData, discipline: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a disciplina" />
              </SelectTrigger>
              <SelectContent>
                {discipline.map((disc) => (
                  <SelectItem key={disc.value} value={disc.value}>
                    {disc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" variant="outline" size="icon" onClick={() => setShowNewDisciplineModal(true)}>
            +
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={handleAddOrUpdate}
          disabled={!formData.name || formData.seniority === -1 || !formData.discipline}
        >
          {isEditing ? "Atualizar" : "Adicionar"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
      {showNewDisciplineModal && (
        <DisciplineForm
          onSubmit={handleNewDisciplineSubmit}
          onCancel={() => setShowNewDisciplineModal(false)}
        />
      )}
    </div>
  );
};

export default CompetencyForm; 