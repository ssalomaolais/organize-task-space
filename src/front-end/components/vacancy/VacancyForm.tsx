import { useState } from "react";

import { Vacancy } from "@/types/task";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import VacancyFormGeneralTabWrapper from "./VacancyFormGeneralTabWrapper";
import VacancyFormKnowledgesTab from "./VacancyFormKnowledgesTab";
import VacancyFormQuestionsTab from "./VacancyFormQuestionsTab";
import { Button } from "@/components/ui/button";
import { getSeniorityLabel} from "@/lib/utils";
import { useDiscipline } from "@/hooks/useDiscipline";

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
  const { discipline } = useDiscipline();
  
  const [formData, setFormData] = useState<Omit<Vacancy, "id" | "created_at" | "updated_at">>({
    title: vacancy?.title || "",
    teams: vacancy?.teams || "",
    daytoday: vacancy?.daytoday || "",
    disciplineId: vacancy?.disciplineId || "",
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
    questions: vacancy?.questions || "",
  });
  const [questionsResult, setQuestionsResult] = useState<string>("");
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Knowledges dynamic list
  const handleKnowledgesChange = (newKnowledges: Array<{ id: string; knowledge: string; required: boolean }>) => {
    setFormData((prev) => ({ ...prev, knowledges: ensureKnowledgeIds(newKnowledges) }));
  };

  const handleQuestionsChange = (value: string) => {
    setFormData((prev) => ({ ...prev, questions: value }));
  };

  const handleGenerateQuestions = async () => {
    setLoadingQuestions(true);
    setQuestionsResult("");
    try {
      // Lê o systemPrompt de um arquivo externo
      const promptRes = await fetch("/SystemPrompt.txt");
      const systemPrompt = await promptRes.text();
      const userPrompt = `Título: ${formData.title}\nSenioridade: ${getSeniorityLabel(formData.seniority)}\nConhecimentos requeridos: ${formData.requirement}\nConhecimentos desejados: ${formData.knowledge}\nPrincipais responsabilidades: ${formData.daytoday}`;
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_IA_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        })
      });
      const data = await response.json();
      const result = data.choices?.[0]?.message?.content || "Erro ao gerar questões.";
      setQuestionsResult(result);
    } catch (err) {
      setQuestionsResult("Erro ao gerar questões.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formData.knowledges = [];
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="geral" className="w-full min-h-[700px]">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="conhecimentos">Conhecimentos</TabsTrigger>
          <TabsTrigger value="questoes">Questões</TabsTrigger>
        </TabsList>
        <TabsContent value="geral">
          <VacancyFormGeneralTabWrapper
            formData={formData}
            handleChange={handleChange}
            onCancel={onCancel}
            handleSubmit={handleSubmit}
            disciplines={discipline}
          />
        </TabsContent>
        <TabsContent value="conhecimentos">
          <VacancyFormKnowledgesTab
            formData={formData}
            handleChange={handleChange}
          />
        </TabsContent>
        <TabsContent value="questoes">
          <VacancyFormQuestionsTab
            formData={formData}
            handleQuestionsChange={handleQuestionsChange}
            handleGenerateQuestions={handleGenerateQuestions}
            loadingQuestions={loadingQuestions}
            questionsResult={questionsResult}
          />
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