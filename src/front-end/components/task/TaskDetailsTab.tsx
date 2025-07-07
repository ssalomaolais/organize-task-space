import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "@/types/task";
import { SeniorityOptions } from "@/lib/utils";

interface TaskDetailsTabProps {
  formData: {
    student_count: number;
    vacancy_count: number;
    syllabus: string;
    seniority: number;
  };
  onInputChange: (field: keyof Task, value: string | number) => void;
}

const TaskDetailsTab = ({ formData, onInputChange }: TaskDetailsTabProps) => {
  return (
    <div className="">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 flex flex-col">
          <Label htmlFor="syllabus">Ementa Geral</Label>
          <Textarea
            id="syllabus"
            value={formData.syllabus}
            onChange={(e) => onInputChange("syllabus", e.target.value)}
            placeholder="Descrição da ementa"
            rows={3}
          />
        </div>        
        <div className="flex flex-col">
          <Label htmlFor="student_count">Qtde Aluno</Label>
          <Input
            id="student_count"
            type="number"
            min="0"
            value={formData.student_count}
            onChange={(e) => onInputChange("student_count", parseInt(e.target.value) || 0)}
            placeholder="Quantidade de alunos"
          />
        </div>
        
        <div className="flex flex-col">
          <Label htmlFor="vacancy_count">Qtde Vagas</Label>
          <Input
            id="vacancy_count"
            type="number"
            min="0"
            value={formData.vacancy_count}
            onChange={(e) => onInputChange("vacancy_count", parseInt(e.target.value) || 0)}
            placeholder="Quantidade de vagas"
          />
        </div>
        
        <div className="flex flex-col">
          <Label htmlFor="seniority">Senioridade</Label>
          <Select 
            onValueChange={(value) => onInputChange("seniority", value === "none" ? "" : value)} 
            value={formData.seniority.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a senioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhuma</SelectItem>
              {SeniorityOptions.map((seniority) => (
                <SelectItem key={seniority.value} value={seniority.value.toString()}>
                  {seniority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsTab; 