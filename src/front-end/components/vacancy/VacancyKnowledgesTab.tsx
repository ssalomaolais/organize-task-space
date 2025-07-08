import KnowledgeList from "./KnowledgeList";

interface VacancyKnowledgesTabProps {
  formData: any;
  onKnowledgesChange: (knowledges: Array<{ id: string; knowledge: string; required: boolean }>) => void;
}

const VacancyKnowledgesTab = ({ formData, onKnowledgesChange }: VacancyKnowledgesTabProps) => (
  <div className="">
    <KnowledgeList
      knowledges={formData.knowledge || []}
      onKnowledgesChange={onKnowledgesChange}
    />
  </div>
);

export default VacancyKnowledgesTab; 