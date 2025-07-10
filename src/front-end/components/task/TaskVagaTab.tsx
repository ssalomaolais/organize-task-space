import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Vacancy } from "@/types/task";
import { useEffect } from "react";
import VacancyGeneralTab from "@/components/task/VacancyGeneralTab";
import VacancyKnowledgeTab from "@/components/task/VacancyKnowledgeTab";
import VacancyEvaluationTab from "@/components/task/VacancyEvaluationTab";

interface TaskVagaTabProps {
  formData: {
    seniority: number;
    vacancy?: string;
  };
  vacancies: Vacancy[];
  selectedVacancyId: string;
  setSelectedVacancyId: (id: string) => void;
  setShowVacancyForm: (show: boolean) => void;
  onVacancyChange: (field: keyof Vacancy, value: string) => void;
  onInputChange: (field: string, value: string) => void;
  fieldsDisabled?: boolean;
}



const TaskVagaTab = ({ formData, vacancies, selectedVacancyId, setSelectedVacancyId, setShowVacancyForm, onVacancyChange, onInputChange }: TaskVagaTabProps) => {
  const selectedVacancy = Array.isArray(vacancies) ? vacancies.find(v => v.id === selectedVacancyId) : undefined;

  useEffect(() => {
    // Só sincronizar se selectedVacancyId estiver vazio E formData.vacancy tiver um valor
    // Isso evita loops infinitos quando limpamos a seleção
    if (!selectedVacancyId && formData.vacancy && formData.vacancy !== "") {
      setSelectedVacancyId(formData.vacancy);
    }
  }, [formData.vacancy, selectedVacancyId, setSelectedVacancyId]);

  const handleClearSelection = () => {
    setSelectedVacancyId("");
    onInputChange("vacancy", "");
    onInputChange("seniority", "-1");
  };

  if (selectedVacancy?.seniority)
    formData.seniority = selectedVacancy.seniority;

  return (
    <Tabs defaultValue="geral" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="geral">Geral</TabsTrigger>
        <TabsTrigger value="conhecimentos">Conhecimentos</TabsTrigger>
        <TabsTrigger value="avaliacao">Avaliação</TabsTrigger>
      </TabsList>
      
      <TabsContent value="geral">
        <VacancyGeneralTab
          selectedVacancy={selectedVacancy}
          selectedVacancyId={selectedVacancyId}
          setSelectedVacancyId={setSelectedVacancyId}
          setShowVacancyForm={setShowVacancyForm}
          handleClearSelection={handleClearSelection}
          vacancies={vacancies}
        />
      </TabsContent>
      
      <TabsContent value="conhecimentos">
        <VacancyKnowledgeTab selectedVacancy={selectedVacancy} />
      </TabsContent>
      
      <TabsContent value="avaliacao">
        <VacancyEvaluationTab selectedVacancy={selectedVacancy} taskStackValue={formData.stack} />
      </TabsContent>
    </Tabs>
  );
};

export default TaskVagaTab; 