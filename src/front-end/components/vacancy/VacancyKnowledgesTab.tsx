import KnowledgeList from "./KnowledgeList";

interface VacancyKnowledgesTabProps {
  knowledge: string;
  knowledges: Array<{ id: string; knowledge: string; required: boolean }>;
  onKnowledgesChange: (knowledges: Array<{ id: string; knowledge: string; required: boolean }>) => void;
}

const VacancyKnowledgesTab = ({ knowledge, knowledges, onKnowledgesChange }: VacancyKnowledgesTabProps) => (


  <div className="">
    <KnowledgeList
      knowledges={knowledges}
      onKnowledgesChange={onKnowledgesChange}
    />
  </div>
);

export default VacancyKnowledgesTab; 