import { useState } from "react";

import { Vacancy } from "@/types/task";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import VacancyFormGeneralTab from "./VacancyFormGeneralTab";
import VacancyKnowledgesTab from "./VacancyKnowledgesTab";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";


interface VacancyFormProps {
  vacancy?: Vacancy | null;
  onSubmit: (data: Omit<Vacancy, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
}

const ensureKnowledgeIds = (knowledges: any[] = []) =>
  knowledges.map((k) => ({
    id: k.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
    knowledge: k.knowledge,
    required: k.required,
  }));

const VacancyForm = ({ vacancy, onSubmit, onCancel }: VacancyFormProps) => {
  const [formData, setFormData] = useState<Omit<Vacancy, "id" | "created_at" | "updated_at">>({
    title: vacancy?.title || "",
    teams: vacancy?.teams || "",
    daytoday: vacancy?.daytoday || "",
    seniority: vacancy?.seniority ?? -1,
    regime: vacancy?.regime || "offsite",
    quantity: vacancy?.quantity || 1,
    gupylink: vacancy?.gupylink || "",
    local: vacancy?.local || "",
    detail: vacancy?.detail || "",
    knowledge: vacancy?.knowledge || "",
    requirement: vacancy?.requirement || "",
    knowledges: ensureKnowledgeIds(vacancy?.knowledges),
    active: vacancy?.active ?? true,
  });

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Knowledges dynamic list
  const handleKnowledgesChange = (newKnowledges: Array<{ id: string; knowledge: string; required: boolean }>) => {
    setFormData((prev) => ({ ...prev, knowledges: ensureKnowledgeIds(newKnowledges) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formData.knowledges = [];
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="geral" className="w-full min-h-[700px]">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="conhecimentos">Conhecimentos</TabsTrigger>
        </TabsList>
        <TabsContent value="geral">
          <VacancyFormGeneralTab
            formData={formData}
            handleChange={handleChange}
            onCancel={onCancel}
            handleSubmit={handleSubmit}
          />
        </TabsContent>
        <TabsContent value="conhecimentos">
          <div className="space-y-4">
            <div>
              <Label className="block mb-1">Conhecimentos Requeridos</Label>
              <Textarea value={formData.requirement} onChange={e => handleChange("requirement", e.target.value)} rows={12} />
            </div>
            <div>
              <Label className="block mb-1">Conhecimentos Diferenciais</Label>
              <Textarea value={formData.knowledge} onChange={e => handleChange("knowledge", e.target.value)} rows={12} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{vacancy ? "Atualizar" : "Salvar"}</Button>
      </div>
    </form>
  );
};

export default VacancyForm; 