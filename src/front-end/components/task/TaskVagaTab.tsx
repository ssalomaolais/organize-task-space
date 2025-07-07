import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SeniorityOptions } from "@/lib/utils";
import { Task, Vacancy } from "@/types/task";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface TaskVagaTabProps {
  formData: {
    student_count: number;
    vacancy_count: number;
    syllabus: string;
    seniority: string;
  };
  vacancy: Vacancy;
  onVacancyChange: (field: keyof Vacancy, value: string) => void;
  syllabus: string;
  seniority: string;
  onInputChange: (field: string, value: string) => void;
}

const TaskVagaTab = ({ formData, vacancy, onVacancyChange, syllabus, seniority, onInputChange }: TaskVagaTabProps) => {
  return (
    <Tabs defaultValue="geral" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="geral">Geral</TabsTrigger>
        <TabsTrigger value="conhecimentos">Conhecimentos</TabsTrigger>
      </TabsList>
      <TabsContent value="geral">
        {/* Campos 'Sobre a equipe', 'Regime de Trabalho', 'Senioridade' e 'Ementa Geral' */}
        <div className="space-y-4 min-h-[200px]">
        <div className="flex flex-col">
              <Label htmlFor="seniority">Senioridade</Label>
              <Select
                onValueChange={(value) => onInputChange("seniority", value === "none" ? "" : value)}
                value={seniority || "none"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a senioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {SeniorityOptions.map((seniority) => (
                    <SelectItem key={seniority.value} value={seniority.value}>
                      {seniority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="flex flex-col">
              <Label htmlFor="regime">Regime de Trabalho</Label>
              <Select
                onValueChange={(value) => onVacancyChange("regime", value)}
                value={vacancy.regime || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o regime de trabalho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="offsite">Offsite</SelectItem>
                  <SelectItem value="hybrid">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="student_count">Qtde Vezes</Label>
              <Input
                id="student_count"
                type="number"
                min="0"
                value={formData.student_count}
                onChange={(e) => onInputChange("student_count", parseInt(e.target.value) || 0)}
                placeholder="Quantidade Vezes"
              />
            </div>

            <div className="flex flex-col justify-end h-full">
          <Label htmlFor="people">Local</Label>
          <Input
            id="people"
            min="0"
            value={vacancy.local || ""}
            onChange={(e) => onVacancyChange("local", e.target.value)}
            placeholder="Ex: Rio"
          />
        </div>            
          </div>
          <div className="flex flex-col">
            <Label htmlFor="syllabus">Complemento</Label>
            <Textarea
              id="syllabus-vaga"
              value={syllabus}
              onChange={(e) => onInputChange("syllabus", e.target.value)}
              placeholder="Complemento da Descrição da Vaga"
              rows={3}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="teams">Sobre a equipe</Label>
            <Textarea
              id="teams-vaga"
              value={vacancy.teams || ""}
              onChange={(e) => onVacancyChange("teams", e.target.value)}
              placeholder="Descreva a equipe da vaga"
              rows={2}
            />
          </div>        </div>
      </TabsContent>
      <TabsContent value="conhecimentos">
        {/* Conteúdo da sub-aba Conhecimentos (em branco por enquanto) */}
      </TabsContent>
    </Tabs>
  );
};

export default TaskVagaTab; 