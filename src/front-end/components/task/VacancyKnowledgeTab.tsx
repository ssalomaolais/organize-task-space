import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Vacancy } from "@/types/task";

interface VacancyKnowledgeTabProps {
  selectedVacancy: Vacancy | undefined;
}

const VacancyKnowledgeTab = ({ selectedVacancy }: VacancyKnowledgeTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="block mb-1">Conhecimentos Requeridos</Label>
          <Textarea
            value={selectedVacancy?.requirement || ""}
            rows={8}
            disabled
            placeholder="Nenhum conhecimento requerido definido"
          />
        </div>

        <div>
          <Label className="block mb-1">Conhecimentos Diferenciais</Label>
          <Textarea
            value={selectedVacancy?.knowledge || ""}
            rows={8}
            disabled
            placeholder="Nenhum conhecimento diferencial definido"
          />
        </div>
      </div>
      <div>
          <Label className="block mb-1">Perguntas Recomendadas</Label>
          <Textarea
            value={selectedVacancy?.questions || ""}
            rows={14}
            disabled
          />
        </div>
    </div>
  );
};

export default VacancyKnowledgeTab; 