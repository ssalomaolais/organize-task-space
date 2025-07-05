import { Responsible } from "@/types/task";
import ResponsibleList from "./ResponsibleList";

interface TaskResponsiblesTabProps {
  responsibles: Responsible[];
  onResponsiblesChange: (responsibles: Responsible[]) => void;
}

const TaskResponsiblesTab = ({ responsibles, onResponsiblesChange }: TaskResponsiblesTabProps) => {
  return (
    <div className="space-y-4 min-h-[400px]">
      <ResponsibleList
        responsibles={responsibles}
        onResponsiblesChange={onResponsiblesChange}
      />
    </div>
  );
};

export default TaskResponsiblesTab; 