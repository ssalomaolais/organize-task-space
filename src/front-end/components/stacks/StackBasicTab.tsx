import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TailwindColors } from "@/lib/utils";

interface StackBasicTabProps {
  value: string;
  label: string;
  color: string;
  isEditing: boolean;
  onChange: (field: "value" | "label" | "color", value: string) => void;
}

const StackBasicTab = ({ value, label, color, isEditing, onChange }: StackBasicTabProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="value">Identificador (único)</Label>
        <Input
          id="value"
          value={value}
          onChange={(e) => onChange("value", e.target.value)}
          required
          disabled={isEditing}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="label">Nome da Comunidade</Label>
        <Input
          id="label"
          value={label}
          onChange={(e) => onChange("label", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="color">Cor</Label>
        <Select
          value={color}
          onValueChange={(value) => onChange("color", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma cor" />
          </SelectTrigger>
          <SelectContent>
            {TailwindColors.map((colorOption) => (
              <SelectItem key={colorOption.value} value={colorOption.value}>
                <div className={`w-4 h-4 rounded-full ${colorOption.preview}`}></div>
                <span>{colorOption.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StackBasicTab; 