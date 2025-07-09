import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface VacancyFormQuestionsTabProps {
  formData: any;
  handleQuestionsChange: (value: string) => void;
  handleGenerateQuestions: () => void;
  loadingQuestions: boolean;
  questionsResult: string;
}

const VacancyFormQuestionsTab = ({
  formData,
  handleQuestionsChange,
  handleGenerateQuestions,
  loadingQuestions,
  questionsResult,
}: VacancyFormQuestionsTabProps) => (
  <div className="flex flex-col h-full min-h-[600px]">
    <Label className="block mb-1">Questões Técnicas</Label>
    <Textarea
      value={formData.questions}
      onChange={e => handleQuestionsChange(e.target.value)}
      rows={24}
      placeholder="Cole ou edite as questões aqui..."
      className="mb-4"
    />
    <div className="flex-1" />
    <div className="flex flex-col items-end gap-2">
      <Button type="button" onClick={handleGenerateQuestions} disabled={loadingQuestions}>
        {loadingQuestions ? "Gerando..." : "Gerar"}
      </Button>
      {questionsResult && (
        <div className="w-full mt-2 p-2 border rounded bg-muted text-sm whitespace-pre-wrap overflow-x-auto">
          {questionsResult}
        </div>
      )}
    </div>
  </div>
);

export default VacancyFormQuestionsTab; 