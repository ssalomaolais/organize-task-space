import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ListValue, Responsible } from "@/types/task";
import { TailwindColors } from "@/lib/utils"; // Import TailwindColors
import StackBasicTab from "./StackBasicTab";
import StackResponsiblesTab from "./StackResponsiblesTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeniorityOptions } from "@/lib/utils";
import CompetenciesEditor from "./CompetenciesEditor";

interface StackFormProps {
  stack?: ListValue | null;
  onSubmit: (stackData: Omit<ListValue, 'id'>) => void;
  onCancel: () => void;
}

// Novo tipo para StackForm
interface Competency {
  id: string;
  name: string;
  minGrade: number;
  seniority: number;
  discipline: string;
}

interface StackFormData extends Omit<ListValue, 'archetype'> {
  responsibles: Responsible[];
  archetype: Competency[];
}

const StackForm = ({ stack, onSubmit, onCancel }: StackFormProps) => {
  const [formData, setFormData] = useState<StackFormData>({
    value: '',
    label: '',
    color: TailwindColors[0].value, // Default to the first color
    responsibles: [],
    archetype: [],
  });

  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (stack) {
      let archetype: Competency[] = [];
      if (Array.isArray(stack.archetype) && stack.archetype.length > 0) {
        // If already flat, just assign
        if ('id' in stack.archetype[0]) {
          archetype = stack.archetype as Competency[];
        } else {
          // Convert from grouped to flat
          archetype = (stack.archetype as any[]).flatMap((group) =>
            (group.competencies || []).map((c: any) => ({
              id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random().toString(36).substring(2, 9),
              name: c.name,
              minGrade: c.minGrade,
              seniority: group.seniority,
              discipline: c.discipline || "",
            }))
          );
        }
      }
      setFormData({
        value: stack.value,
        label: stack.label,
        color: stack.color || TailwindColors[0].value, // Fallback to default if color is missing
        responsibles: (stack as any).responsibles || [],
        archetype,
      });
    }
  }, [stack]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!stack;

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="min-w-[900px] min-h-[650px] max-h-[90vh] overflow-y-auto transition-all duration-300">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Comunidade' : 'Nova Comunidade'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full min-h-[650px]">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="basic">Principal</TabsTrigger>
              <TabsTrigger value="responsibles">Contatos</TabsTrigger>
              <TabsTrigger value="archetype">Itens de Avaliação</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <StackBasicTab
                value={formData.value}
                label={formData.label}
                color={formData.color}
                isEditing={isEditing}
                onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
              />
            </TabsContent>
            <TabsContent value="responsibles">
              <StackResponsiblesTab
                responsibles={formData.responsibles}
                onResponsiblesChange={(responsibles) => setFormData(prev => ({ ...prev, responsibles }))}
              />
            </TabsContent>
            <TabsContent value="archetype">
              <div className="space-y-4">
                <CompetenciesEditor
                  competencies={formData.archetype as any}
                  onChange={archetype => setFormData(prev => ({ ...prev, archetype }))}
                />
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="w-[95px]">
              {isEditing ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StackForm;