import { Knowledge } from "@/types/task";
import KnowledgesList from "./KnowledgesList";

interface TaskKnowledgesTabProps {
  knowledges: Knowledge[];
  onKnowledgesChange: (responsibles: Knowledge[]) => void;
}

const TaskKnowledgesTab = ({ knowledges, onKnowledgesChange }: TaskKnowledgesTabProps) => {
  return (
    <div className="space-y-4 min-h-[400px]">
      <KnowledgesList
        knowledges={knowledges}
        onKnowledgesChange={onKnowledgesChange}
      />
    </div>
  );
};

export default TaskKnowledgesTab; 