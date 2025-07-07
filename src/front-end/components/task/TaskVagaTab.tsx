import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { SeniorityOptions } from "@/lib/utils";
import { Task, Vacancy } from "@/types/task";
import { Plus, Trash2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { useState, useEffect } from "react";

interface TaskVagaTabProps {
  formData: {
    seniority: number;
    vacancy?: string;
  };
  vacancies: Vacancy[];
  selectedVacancyId: string;
  setSelectedVacancyId: (id: string) => void;
  setShowVacancyForm: (show: boolean) => void;
  onVacancyChange: (field: keyof Vacancy, value: string) => void;
  onInputChange: (field: string, value: string) => void;
  fieldsDisabled?: boolean;
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

const TaskVagaTab = ({ formData, vacancies, selectedVacancyId, setSelectedVacancyId, setShowVacancyForm, onVacancyChange, onInputChange }: TaskVagaTabProps) => {
  const selectedVacancy = Array.isArray(vacancies) ? vacancies.find(v => v.id === selectedVacancyId) : undefined;
  const seniorityLabel = (selectedVacancy && typeof selectedVacancy.seniority !== 'undefined' && SeniorityOptions)
    ? (SeniorityOptions.find(opt => opt.value === selectedVacancy.seniority)?.label || "")
    : "";

  useEffect(() => {
    // Só sincronizar se selectedVacancyId estiver vazio E formData.vacancy tiver um valor
    // Isso evita loops infinitos quando limpamos a seleção
    if (!selectedVacancyId && formData.vacancy && formData.vacancy !== "") {
      setSelectedVacancyId(formData.vacancy);
    }
  }, [formData.vacancy, selectedVacancyId, setSelectedVacancyId]);

  const handleClearSelection = () => {
    setSelectedVacancyId("");
    onInputChange("vacancy", "");
    onInputChange("seniority", "-1");
  };

  if (selectedVacancy?.seniority)
    formData.seniority = selectedVacancy.seniority;

  return (
    <Tabs defaultValue="geral" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="geral">Geral</TabsTrigger>
        <TabsTrigger value="conhecimentos">Conhecimentos</TabsTrigger>
        <TabsTrigger value="avaliacao">Avaliação</TabsTrigger>
      </TabsList>
      <TabsContent value="geral">
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
                value={selectedVacancy && selectedVacancy.regime ? (selectedVacancy.regime === "offsite" ? "Offsite" : selectedVacancy.regime === "hybrid" ? "Híbrido" : selectedVacancy.regime === "físico" ? "Físico" : "") : ""}
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
      </TabsContent>
      <TabsContent value="conhecimentos">
        <div>
          <Label className="block mb-1">Conhecimentos</Label>
          <Textarea value={selectedVacancy?.knowledge} rows={25} disabled />
        </div>
      </TabsContent>
      <TabsContent value="avaliacao"> 
      </TabsContent>
    </Tabs>
  );
};

export default TaskVagaTab; 