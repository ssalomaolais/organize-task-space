import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SeniorityOptions, RegimeOptions } from "@/lib/utils";
import { ListValue } from "@/types/task";

interface VacancyFormGeneralTabProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  onCancel: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  disciplines: ListValue[];
}

const VacancyFormGeneralTab = ({ formData, handleChange, onCancel, handleSubmit, disciplines }: VacancyFormGeneralTabProps) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label className="block mb-1">Título *</Label>
        <Input value={formData.title} onChange={e => handleChange("title", e.target.value)} required />
      </div>
      <div>
        <Label className="block mb-1">Link Gupy</Label>
        <Input value={formData.gupylink} onChange={e => handleChange("gupylink", e.target.value)} />
      </div>
    </div>
    <div>
      <Label className="block mb-1">Disciplina</Label>
      <Select 
        value={formData.disciplineId || "none"} 
        onValueChange={v => handleChange("disciplineId", v === "none" ? "" : v)}
      >
        <SelectTrigger><SelectValue placeholder="Selecione uma disciplina" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Nenhuma disciplina</SelectItem>
          {disciplines.map(discipline => (
            <SelectItem key={discipline.value} value={discipline.value}>{discipline.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label className="block mb-1">Senioridade *</Label>
      <Select value={formData.seniority.toString()} onValueChange={v => handleChange("seniority", Number(v))}>
        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
        <SelectContent>
          {SeniorityOptions.map(opt => (
            <SelectItem key={opt.value} value={opt.value.toString()}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label className="block mb-1">Regime de Trabalho *</Label>
        <Select value={formData.regime} onValueChange={v => handleChange("regime", v) }>
          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
          <SelectContent>
            {RegimeOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="block mb-1">Quantidade Vezes*</Label>
        <Input type="number" min={1} value={formData.quantity} onChange={e => handleChange("quantity", Number(e.target.value))} required />
      </div>
      <div>
        <Label className="block mb-1">Local</Label>
        <Input value={formData.local} onChange={e => handleChange("local", e.target.value)} />
      </div>
    </div>
    <div>
      <Label className="block mb-1">Sobre a Equipe</Label>
      <Input value={formData.teams} onChange={e => handleChange("teams", e.target.value)} />
    </div>
    <div>
      <Label className="block mb-1">Complemento</Label>
      <Textarea value={formData.detail} onChange={e => handleChange("detail", e.target.value)} rows={6} />
    </div>
    <div>
      <Label className="block mb-1">Rotina Diária</Label>
      <Textarea value={formData.daytoday} onChange={e => handleChange("daytoday", e.target.value)} rows={4} />
    </div>
    <div className="flex items-center gap-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.active ?? true}
          onChange={e => handleChange("active", e.target.checked)}
        />
        Ativa
      </label>
    </div>
  </div>
);

export default VacancyFormGeneralTab; 