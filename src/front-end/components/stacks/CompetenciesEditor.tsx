import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { SeniorityOptions } from "@/lib/utils";
import CompetencyForm, { CompetencyFormValues } from "./CompetencyForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Competency {
  id: string;
  name: string;
  minGrade: number;
  seniority: number;
  discipline: string;
}

interface CompetenciesEditorProps {
  competencies: Competency[];
  onChange: (competencies: Competency[]) => void;
}

const CompetenciesEditor: React.FC<CompetenciesEditorProps> = ({ competencies, onChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");

  const handleAdd = (values: CompetencyFormValues) => {
    const newCompetency: Competency = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random().toString(36).substring(2, 9),
      ...values,
    };
    onChange([...competencies, newCompetency]);
    setIsAdding(false);
  };

  const handleEdit = (id: string, values: CompetencyFormValues) => {
    const updated = competencies.map((c) =>
      c.id === id ? { ...c, ...values } : c
    );
    onChange(updated);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updated = competencies.filter((c) => c.id !== id);
    onChange(updated);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (id: string) => {
    console.log('handleStartEdit called with id:', id);
    setEditingId(id);
    setIsAdding(false);
  };

  useEffect(() => {
    console.log('CompetenciesEditor editingId:', editingId);
    console.log('CompetenciesEditor editingCompetency:', editingId ? competencies.find(c => c.id === editingId) : undefined);
  }, [editingId, competencies]);

  const handleImport = () => {
    const lines = importText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const newCompetencies: Competency[] = [];
    let error = "";
    for (const line of lines) {
      const [seniorityLabel, name, minGradeStr, discipline] = line.split("|").map(s => s.trim());
      const seniorityOpt = SeniorityOptions.find(opt => opt.label.toLowerCase() === (seniorityLabel || "").toLowerCase());
      if (!seniorityOpt || !name || !minGradeStr || !discipline) {
        error = `Linha inválida: "${line}"`;
        break;
      }
      const minGrade = Number(minGradeStr);
      if (isNaN(minGrade)) {
        error = `Nota inválida na linha: "${line}"`;
        break;
      }
      newCompetencies.push({
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random().toString(36).substring(2, 9),
        name,
        minGrade,
        seniority: seniorityOpt.value,
        discipline,
      });
    }
    if (error) {
      setImportError(error);
      return;
    }
    onChange([...competencies, ...newCompetencies]);
    setShowImport(false);
    setImportText("");
    setImportError("");
  };

  const editingCompetency = editingId ? competencies.find(c => c.id === editingId) : undefined;

  // Agrupar competências por senioridade
  const grouped = SeniorityOptions.map(opt => ({
    ...opt,
    competencies: competencies.filter(c => c.seniority === opt.value)
  })).filter(group => group.competencies.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Competências</h3>
        <div className="flex gap-2">
          {!isAdding && !editingId && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleStartAdd}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Adicionar
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowImport(true)}
                className="flex items-center gap-2"
              >
                Importar
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Formulário de Adição/Edição */}
      {isAdding && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <CompetencyForm
            onSubmit={handleAdd}
            onCancel={handleCancel}
            isEditing={false}
          />
        </div>
      )}
      {editingId && editingCompetency && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <CompetencyForm
            key={editingId}
            initialValue={{
              name: editingCompetency.name || "",
              minGrade: editingCompetency.minGrade ?? 0,
              seniority: editingCompetency.seniority ?? -1,
              discipline: editingCompetency.discipline || "",
            }}
            onSubmit={values => handleEdit(editingId, values)}
            onCancel={handleCancel}
            isEditing={true}
          />
        </div>
      )}

      {/* Lista de Competências agrupadas por senioridade */}
      {grouped.length > 0 && (
        <div className="space-y-6">
          {grouped.map(group => (
            <div key={group.value} className="border rounded-lg">
              <div className="bg-gray-100 px-4 py-2 font-semibold rounded-t">{group.label}</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Nota mínima</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.competencies.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.minGrade}</TableCell>
                      <TableCell>{c.discipline}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartEdit(c.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(c.id)}
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
          ))}
        </div>
      )}
      {competencies.length === 0 && !isAdding && !editingId && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma competência adicionada ainda.
        </div>
      )}

      {/* Dialog de Importação */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Importar Competências</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <label className="block font-medium">Cole o texto no formato:<br /><span className="text-xs">Senioridade|Nome|Nota|Disciplina</span></label>
            <Textarea
              rows={8}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder={"Júnior|.Net Conceito|7|.Net\nJúnior|Javascript|7|.Net\nPleno|.Net Conceito|7|.Net"}
            />
            {importError && <div className="text-red-500 text-sm">{importError}</div>}
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => { setShowImport(false); setImportError(""); }}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleImport}>
                Importar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompetenciesEditor; 