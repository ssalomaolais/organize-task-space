import ResponsibleList from "@/components/task/ResponsibleList";
import { Responsible } from "@/types/task";

interface UserResponsiblesTabProps {
  responsibles: Responsible[];
  onResponsiblesChange: (responsibles: Responsible[]) => void;
}

const UserResponsiblesTab = ({ responsibles, onResponsiblesChange }: UserResponsiblesTabProps) => (
  <ResponsibleList
    responsibles={responsibles}
    onResponsiblesChange={onResponsiblesChange}
  />
);

export default UserResponsiblesTab; 