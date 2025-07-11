import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Responsible, ListValue } from "@/types/task";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useDiscipline } from "@/hooks/useDiscipline";
import { ResponsibleTypes, getResponsibleTypesLabel } from "@/lib/utils"
import DisciplineForm from "@/components/disciplines/DisciplineForm";

interface ResponsibleListProps {
  responsibles: Responsible[];
  onResponsiblesChange: (responsibles: Responsible[]) => void;
  showSyllabusField?: boolean;
  showNotesField?: boolean;
}

const ResponsibleList = ({ responsibles, onResponsiblesChange, showSyllabusField = true, showNotesField = false }: ResponsibleListProps) => {
  const { discipline, createDiscipline, fetchDiscipline } = useDiscipline();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewDisciplineModal, setShowNewDisciplineModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    discipline: "",
    email: "",
    syllabus: "",
    notes: "",
  });

  const handleAdd = () => {
    if (!formData.name || !formData.type) {
      return;
    }

    const newResponsible: Responsible = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      discipline: formData.discipline || undefined,
      email: formData.email || undefined,
      syllabus: formData.syllabus || undefined,
      notes: formData.notes || undefined,
    };

    onResponsiblesChange([...responsibles, newResponsible]);
    setFormData({ name: "", type: "", discipline: "", email: "", syllabus: "", notes: "" });
    setIsAdding(false);
  };

  const handleEdit = (responsible: Responsible) => {
    setEditingId(responsible.id);
    setFormData({
      name: responsible.name,
      type: responsible.type,
      discipline: responsible.discipline || "",
      email: responsible.email || "",
      syllabus: responsible.syllabus || "",
      notes: responsible.notes || "",
    });
  };

  const handleUpdate = () => {
    if (!formData.name || !formData.type) {
      return;
    }

    const updatedResponsibles = responsibles.map((r) =>
      r.id === editingId
        ? {
            ...r,
            name: formData.name,
            type: formData.type,
            discipline: formData.discipline || undefined,
            email: formData.email || undefined,
            syllabus: formData.syllabus || undefined,
            notes: formData.notes || undefined,
          }
        : r
    );

    onResponsiblesChange(updatedResponsibles);
    setFormData({ name: "", type: "", discipline: "", email: "", syllabus: "", notes: "" });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updatedResponsibles = responsibles.filter((r) => r.id !== id);
    onResponsiblesChange(updatedResponsibles);
  };

  const handleCancel = () => {
    setFormData({ name: "", type: "", discipline: "", email: "", syllabus: "", notes: "" });
    setIsAdding(false);
    setEditingId(null);
  };

  const getDisciplineLabel = (disciplineValue: string) => {
    return discipline.find((d) => d.value === disciplineValue)?.label || disciplineValue;
  };

  const handleNewDisciplineSubmit = async (newDisciplineData: Omit<ListValue, 'id'>) => {
    const result = await createDiscipline(newDisciplineData);
    if (result.data) {
      await fetchDiscipline(); // Refresh disciplines in the dropdown
      setFormData(prev => ({ ...prev, discipline: result.data!.value })); // Select the new discipline
      setShowNewDisciplineModal(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Responsáveis</h3>
        {!isAdding && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        )}
      </div>

      {/* Formulário de Adição/Edição */}
      {(isAdding || editingId) && (
        <div className="border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="responsible-name">Nome *</Label>
              <Input
                id="responsible-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do responsável"
              />
            </div>
            <div>
              <Label htmlFor="responsible-email">Email</Label>
              <Input
                id="responsible-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>            
            <div>
              <Label htmlFor="responsible-type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {ResponsibleTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2 h-full">
              {(formData.type === "instructor" || formData.type === "interviewer" || formData.type === "reference")  && (
                <>
                  <div className="flex-1 flex flex-col justify-end h-full">
                    <Label htmlFor="responsible-discipline">Disciplina</Label>
                    <Select
                      value={formData.discipline}
                      onValueChange={(value) => setFormData({ ...formData, discipline: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a disciplina" />
                      </SelectTrigger>
                      <SelectContent>
                        {discipline.map((disc) => (
                          <SelectItem key={disc.value} value={disc.value}>
                            {disc.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="button" variant="outline" size="icon" onClick={() => setShowNewDisciplineModal(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Campo Ementa só aparece se o tipo for instrutor E showSyllabusField for true */}
            {formData.type === "instructor" && showSyllabusField && (
              <div className="md:col-span-4">
                <Label htmlFor="responsible-syllabus">Ementa</Label>
                <textarea
                  id="responsible-syllabus"
                  className="w-full min-h-[80px] border rounded p-2 resize-none"
                  value={formData.syllabus}
                  onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
                  placeholder="Ementa do responsável"
                />
              </div>
            )}
            {/* Campo Anotações só aparece se showNotesField for true */}
            {showNotesField && (
              <div className="md:col-span-4">
                <Label htmlFor="responsible-notes">Anotações</Label>
                <textarea
                  id="responsible-notes"
                  className="w-full min-h-[60px] border rounded p-2 resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Anotações do responsável"
                />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={!formData.name || !formData.type}
            >
              {editingId ? "Atualizar" : "Adicionar"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Lista de Responsáveis */}
      {responsibles.length > 0 && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responsibles.map((responsible) => (
                <TableRow key={responsible.id}>
                  <TableCell className="font-medium">{responsible.name}</TableCell>
                  <TableCell>{responsible.email || "-"}</TableCell>
                  <TableCell>{getResponsibleTypesLabel(responsible.type)}</TableCell>
                  <TableCell>{responsible.discipline ? getDisciplineLabel(responsible.discipline) : "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(responsible)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(responsible.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {responsibles.length === 0 && !isAdding && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum responsável adicionado ainda.
        </div>
      )}

      {showNewDisciplineModal && (
        <DisciplineForm
          onSubmit={handleNewDisciplineSubmit}
          onCancel={() => setShowNewDisciplineModal(false)}
        />
      )}
    </div>
  );
};

export default ResponsibleList; 