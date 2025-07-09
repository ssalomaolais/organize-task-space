import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface VacancyFormKnowledgesTabProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}

const VacancyFormKnowledgesTab = ({ formData, handleChange }: VacancyFormKnowledgesTabProps) => (
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
);

export default VacancyFormKnowledgesTab; 