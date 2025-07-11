import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Knowledge, ListValue } from "@/types/task";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useDiscipline } from "@/hooks/useDiscipline";
import DisciplineForm from "@/components/disciplines/DisciplineForm";
import {getResponsibleTypesLabel} from "@/lib/utils"

interface KnowledgesListProps {
  knowledges: Knowledge[];
  onKnowledgesChange: (knowledges: Knowledge[]) => void;
}


const KnowledgesList = ({ knowledges, onKnowledgesChange }: KnowledgesListProps) => {
  const { discipline, createDiscipline, fetchDiscipline } = useDiscipline();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewDisciplineModal, setShowNewDisciplineModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    min: 0,
  });

  const handleAdd = () => {
    if (!formData.name || !formData.min) {
      return;
    }

    const newKnowledge: Knowledge = {
      id: Date.now().toString(),
      name: formData.name,
      min: formData.min,
    };

    onKnowledgesChange([...knowledges, newKnowledge]);
    setFormData({ name: "", min: 0 });
    setIsAdding(false);
  };

  const handleEdit = (Knowledge: Knowledge) => {
    setEditingId(Knowledge.id);
    setFormData({
      name: Knowledge.name,
      min: Knowledge.min,
    });
  };

  const handleUpdate = () => {
    if (!formData.name || !formData.min) {
      return;
    }

    const updatedknowledges = knowledges.map((r) =>
      r.id === editingId
        ? {
            ...r,
            name: formData.name,
            min: formData.min,
          }
        : r
    );

    onKnowledgesChange(updatedknowledges);
    setFormData({ name: "", min: 0 });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updatedknowledges = knowledges.filter((r) => r.id !== id);
    onKnowledgesChange(updatedknowledges);
  };

  const handleCancel = () => {
    setFormData({ name: "", min: 0 });
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
        <h3 className="text-lg font-medium">Conhecimentos</h3>
        {!isAdding && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Conhecimento
          </Button>
        )}
      </div>

      {/* Formulário de Adição/Edição */}
      {(isAdding || editingId) && (
        <div className="border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="Knowledge-name">Nome *</Label>
              <Input
                id="Knowledge-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do conhecimento"
              />
            </div>
            <div>
              <Label htmlFor="Knowledge-name">Tempo Mínimo *</Label>
              <Input
                id="Knowledge-min"
                type="number"
                value={formData.min}
                onChange={(e) => setFormData({ ...formData, min: parseInt(e.target.value) || 0 })}
                placeholder="Tempo Mínimo"
              />
            </div>

          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={!formData.name || !formData.min}
            >
              {editingId ? "Atualizar" : "Adicionar"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Lista de Conhecimentos */}
      {knowledges.length > 0 && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tempo Mínimo</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {knowledges.map((Knowledge) => (
                <TableRow key={Knowledge.id}>
                  <TableCell className="font-medium">{Knowledge.name}</TableCell>
                  <TableCell>{Knowledge.min}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(Knowledge)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(Knowledge.id)}
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

      {knowledges.length === 0 && !isAdding && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum conhecimento adicionado ainda.
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

export default KnowledgesList; 