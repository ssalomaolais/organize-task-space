import VacancyFormGeneralTab from "./VacancyFormGeneralTab";

interface VacancyFormGeneralTabWrapperProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  onCancel: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const VacancyFormGeneralTabWrapper = ({
  formData,
  handleChange,
  onCancel,
  handleSubmit,
}: VacancyFormGeneralTabWrapperProps) => (
  <VacancyFormGeneralTab
    formData={formData}
    handleChange={handleChange}
    onCancel={onCancel}
    handleSubmit={handleSubmit}
  />
);

export default VacancyFormGeneralTabWrapper; 