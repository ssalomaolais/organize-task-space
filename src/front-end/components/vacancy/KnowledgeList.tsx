import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Knowledge {
  id: string;
  knowledge: string;
  required: boolean;
}

interface KnowledgeListProps {
  knowledges: Knowledge[];
  onKnowledgesChange: (knowledges: Knowledge[]) => void;
}

const KnowledgeList = ({ knowledges, onKnowledgesChange }: KnowledgeListProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    knowledge: "",
    required: false,
  });

  const handleAdd = () => {
    if (!formData.knowledge) return;
    const newKnowledge: Knowledge = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random().toString(36).substring(2, 9),
      knowledge: formData.knowledge,
      required: formData.required,
    };
    onKnowledgesChange([...knowledges, newKnowledge]);
    setFormData({ knowledge: "", required: false });
    setIsAdding(false);
  };

  const handleEdit = (knowledge: Knowledge) => {
    setEditingId(knowledge.id);
    setFormData({ knowledge: knowledge.knowledge, required: knowledge.required });
  };

  const handleUpdate = () => {
    if (!formData.knowledge) return;
    const updatedKnowledges = knowledges.map((k) =>
      k.id === editingId
        ? { ...k, knowledge: formData.knowledge, required: formData.required }
        : k
    );
    onKnowledgesChange(updatedKnowledges);
    setFormData({ knowledge: "", required: false });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updatedKnowledges = knowledges.filter((k) => k.id !== id);
    onKnowledgesChange(updatedKnowledges);
  };

  const handleCancel = () => {
    setFormData({ knowledge: "", required: false });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Conhecimentos</h3>
        {!isAdding && !editingId && (
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-3">
              <Label htmlFor="knowledge-name">Conhecimento *</Label>
              <Input
                id="knowledge-name"
                value={formData.knowledge}
                onChange={(e) => setFormData({ ...formData, knowledge: e.target.value })}
                placeholder="Nome do conhecimento"
              />
            </div>
            <div className="flex items-center gap-2 h-full">
              <label className="flex items-center gap-1 mt-6">
                <input
                  type="checkbox"
                  checked={formData.required}
                  onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                />
                Requerido
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={!formData.knowledge}
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
      {knowledges && knowledges.length > 0 && (
        <div className="border rounded-lg">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Conhecimento</th>
                <th className="text-left p-2">Requerido</th>
                <th className="text-left p-2 w-[100px]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {knowledges?.map((k) => (
                <tr key={k.id}>
                  <td className="p-2 font-medium">{k.knowledge}</td>
                  <td className="p-2">{k.required ? "Sim" : "Não"}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(k)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(k.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(!knowledges || knowledges.length === 0) && !isAdding && !editingId && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum conhecimento adicionado ainda.
        </div>
      )}
    </div>
  );
};

export default KnowledgeList; 