import VacancyFormGeneralTab from "./VacancyFormGeneralTab";
import { ListValue } from "@/types/task";

interface VacancyFormGeneralTabWrapperProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  onCancel: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  disciplines: ListValue[];
}

const VacancyFormGeneralTabWrapper = ({
  formData,
  handleChange,
  onCancel,
  handleSubmit,
  disciplines
}: VacancyFormGeneralTabWrapperProps) => (
  <VacancyFormGeneralTab
    formData={formData}
    handleChange={handleChange}
    onCancel={onCancel}
    handleSubmit={handleSubmit}
    disciplines={disciplines}
  />
);

export default VacancyFormGeneralTabWrapper; 