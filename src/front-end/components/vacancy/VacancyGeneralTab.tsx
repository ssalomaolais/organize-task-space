import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { SeniorityOptions } from "@/lib/utils";

const regimeOptions = [
  { value: "offsite", label: "Offsite" },
  { value: "hybrid", label: "Híbrido" },
];

interface VacancyGeneralTabProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  onCancel: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const VacancyGeneralTab = ({ formData, handleChange, onCancel, handleSubmit }: VacancyGeneralTabProps) => (
  <form onSubmit={handleSubmit} className="">
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
        <Select value={formData.regime} onValueChange={v => handleChange("regime", v as "offsite" | "hybrid") }>
          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
          <SelectContent>
            {regimeOptions.map(opt => (
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

  </form>
);

export default VacancyGeneralTab; 