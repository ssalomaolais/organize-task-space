import ResponsibleList from "../task/ResponsibleList";
import { Responsible } from "@/types/task";

interface StackResponsiblesTabProps {
  responsibles: Responsible[];
  onResponsiblesChange: (responsibles: Responsible[]) => void;
}

const StackResponsiblesTab = ({ responsibles, onResponsiblesChange }: StackResponsiblesTabProps) => {
  return (
    <div className="space-y-4">
      <ResponsibleList
        responsibles={responsibles}
        onResponsiblesChange={onResponsiblesChange}
        showSyllabusField={false}
        showNotesField={true}
      />
    </div>
  );
};

export default StackResponsiblesTab; 