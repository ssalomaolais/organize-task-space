import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SeniorityOptions, getRegimeOptionsLabel } from "@/lib/utils";
import { Vacancy } from "@/types/task";
import { Plus, Trash2 } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { useState } from "react";

interface VacancyGeneralTabProps {
  selectedVacancy: Vacancy | undefined;
  selectedVacancyId: string;
  setSelectedVacancyId: (id: string) => void;
  setShowVacancyForm: (show: boolean) => void;
  handleClearSelection: () => void;
  vacancies: Vacancy[];
}

function VacancyComboBox({ vacancies, value, onChange }: {
  vacancies: Vacancy[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = Array.isArray(vacancies) ? vacancies.find(v => v.id === value) : undefined;
  const filtered = search && Array.isArray(vacancies)
    ? vacancies.filter(v => v.title.toLowerCase().includes(search.toLowerCase()))
    : vacancies || [];
  
  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between"
        onClick={() => setOpen(o => !o)}
      >
        {selected ? selected.title : "Selecione uma vaga"}
        <span className="ml-2">▼</span>
      </Button>
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border rounded shadow-lg">
          <Command>
            <CommandInput placeholder="Buscar vaga..." value={search} onValueChange={setSearch} />
            <CommandList>
              <CommandEmpty>Nenhuma vaga encontrada.</CommandEmpty>
              {filtered.map(v => (
                <CommandItem
                  key={v.id}
                  value={v.title}
                  onSelect={() => {
                    onChange(v.id);
                    setOpen(false);
                  }}
                >
                  {v.title}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}

const VacancyGeneralTab = ({ 
  selectedVacancy, 
  selectedVacancyId, 
  setSelectedVacancyId, 
  setShowVacancyForm, 
  handleClearSelection,
  vacancies
}: VacancyGeneralTabProps) => {
  const seniorityLabel = (selectedVacancy && typeof selectedVacancy.seniority !== 'undefined' && SeniorityOptions)
    ? (SeniorityOptions.find(opt => opt.value === selectedVacancy.seniority)?.label || "")
    : "";

  const getRegimeLabel = (regime: string) => {
    return getRegimeOptionsLabel(regime);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Label htmlFor="vacancy-select" className="mb-1 block">Selecionar Vaga</Label>
        <div className="relative flex items-center gap-2">
          <div className="flex-1">
            <VacancyComboBox
              vacancies={vacancies}
              value={selectedVacancyId}
              onChange={setSelectedVacancyId}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClearSelection}
            disabled={!selectedVacancyId}
            title="Limpar seleção"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowVacancyForm(true)}
            title="Cadastrar nova vaga"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col">
        <Label htmlFor="seniority">Senioridade</Label>
        <Input
          id="seniority"
          value={seniorityLabel}
          disabled
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <Label htmlFor="regime">Regime de Trabalho</Label>
          <Input
            id="regime"
            value={selectedVacancy && selectedVacancy.regime ? getRegimeLabel(selectedVacancy.regime) : ""}
            disabled
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="student_count">Qtde Vezes</Label>
          <Input
            id="student_count"
            value={selectedVacancy && typeof selectedVacancy.quantity !== 'undefined' ? selectedVacancy.quantity : ""}
            disabled
          />
        </div>
        <div className="flex flex-col justify-end h-full">
          <Label htmlFor="people">Local</Label>
          <Input
            id="people"
            value={selectedVacancy && selectedVacancy.local ? selectedVacancy.local : ""}
            disabled
          />
        </div>
      </div>
      <div className="flex flex-col">
        <Label htmlFor="syllabus">Complemento</Label>
        <Textarea
          id="syllabus-vaga"
          value={selectedVacancy && selectedVacancy.detail ? selectedVacancy.detail : ""}
          rows={6}
          disabled
        />
      </div>
      <div className="flex flex-col">
        <Label htmlFor="teams">Sobre a equipe</Label>
        <Textarea
          id="teams-vaga"
          value={selectedVacancy && selectedVacancy.teams ? selectedVacancy.teams : ""}
          rows={5}
          disabled
        />
      </div>
    </div>
  );
};

export default VacancyGeneralTab; 