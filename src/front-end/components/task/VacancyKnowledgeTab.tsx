import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Vacancy } from "@/types/task";

interface VacancyKnowledgeTabProps {
  selectedVacancy: Vacancy | undefined;
}

const VacancyKnowledgeTab = ({ selectedVacancy }: VacancyKnowledgeTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="block mb-1">Conhecimentos Requeridos</Label>
        <Textarea 
          value={selectedVacancy?.requirement || ""} 
          rows={11} 
          disabled 
          placeholder="Nenhum conhecimento requerido definido"
        />
      </div>
      
      <div>
        <Label className="block mb-1">Conhecimentos Diferenciais</Label>
        <Textarea 
          value={selectedVacancy?.knowledge || ""} 
          rows={11} 
          disabled 
          placeholder="Nenhum conhecimento diferencial definido"
        />
      </div>
    </div>
  );
};

export default VacancyKnowledgeTab; 