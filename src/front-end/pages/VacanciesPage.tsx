import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, ArrowLeft } from "lucide-react";
import { useVacancies } from "@/hooks/useVacancies";
import { Vacancy } from "@/types/task";
import { Loading } from "@/components/shared/loading";
import VacancyForm from "@/components/vacancy/VacancyForm";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SeniorityOptions } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDiscipline } from "@/hooks/useDiscipline";

interface VacanciesPageProps {
  colorType: string;
  onBack: () => void;
}

function VacanciesPage({ colorType, onBack }: VacanciesPageProps) {
  const { vacancies, loading, totalCount, fetchVacancies, createVacancy, updateVacancy } = useVacancies();
  const { discipline } = useDiscipline();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showVacancyForm, setShowVacancyForm] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchVacancies(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleCreate = async (data: Omit<Vacancy, "id" | "created_at" | "updated_at">) => {
    const result = await createVacancy(data);
    if (!result.error) {
      setShowVacancyForm(false);
      fetchVacancies(currentPage, pageSize, searchTerm);
    }
  };

  const handleEdit = async (data: Omit<Vacancy, "id" | "created_at" | "updated_at">) => {
    if (!editingVacancy) return;
    const result = await updateVacancy(editingVacancy.id, data);
    if (!result.error) {
      setEditingVacancy(null);
      setShowVacancyForm(false);
      fetchVacancies(currentPage, pageSize, searchTerm);
    }
  };

  // Filtrar por status no frontend
  const filteredVacancies = statusFilter === "all"
    ? vacancies
    : vacancies.filter(v => statusFilter === "active" ? v.active : !v.active);

  const getSeniorityLabel = (value: number) => SeniorityOptions.find(opt => opt.value === value)?.label || value;

  const getDisciplineLabel = (disciplineId: string) => {
    return discipline.find(d => d.value === disciplineId)?.label || "";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filtros */}
      <div className={`sticky top-16 z-40 px-1 py-2 border-b border-gray-200 ${colorType}`}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 w-[312px] max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por título, equipe ou local..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="text-black pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-40 text-black">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="inactive">Inativas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={pageSize.toString()} onValueChange={v => { setPageSize(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-32 text-black">
                <SelectValue placeholder="Por página" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => { setShowVacancyForm(true); setEditingVacancy(null); }}>
              <Plus className="w-4 h-4" />
              Nova Vaga
            </Button>
            <Button onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>
      {/* Conteúdo */}
      <div className="p-0">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Vagas ({filteredVacancies.length})</span>
              <Badge variant="outline">
                Página {currentPage} de {totalPages}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loading loading={loading} />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Equipe</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Regime</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead>Senioridade</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVacancies.map((vacancy: Vacancy) => (
                      <TableRow key={vacancy.id}>
                        <TableCell className="font-medium">{vacancy.title}</TableCell>
                        <TableCell>{vacancy.teams}</TableCell>
                        <TableCell>{getDisciplineLabel(vacancy.disciplineId || "")}</TableCell>
                        <TableCell>{vacancy.regime === "offsite" ? "Offsite" : "Híbrido"}</TableCell>
                        <TableCell>{vacancy.local}</TableCell>
                        <TableCell>{getSeniorityLabel(vacancy.seniority)}</TableCell>
                        <TableCell>{vacancy.quantity}</TableCell>
                        <TableCell>
                          <Badge className={vacancy.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {vacancy.active ? 'Ativa' : 'Inativa'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(vacancy.created_at).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => { setEditingVacancy(vacancy); setShowVacancyForm(true); }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-6">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Anterior
                    </Button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Próxima
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Modal de formulário */}
      {showVacancyForm && (
        <Dialog open={showVacancyForm} onOpenChange={() => { setShowVacancyForm(false); setEditingVacancy(null); }}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto transition-all duration-300">
            <DialogHeader>
              <DialogTitle>{editingVacancy ? "Editar Vaga" : "Nova Vaga"}</DialogTitle>
              <DialogDescription>
                {editingVacancy
                  ? "Modifique os detalhes da vaga. Todos os campos obrigatórios devem ser preenchidos."
                  : "Preencha os detalhes da nova vaga. Todos os campos obrigatórios devem ser preenchidos."}
              </DialogDescription>
            </DialogHeader>
            <VacancyForm
              vacancy={editingVacancy}
              onSubmit={editingVacancy ? handleEdit : handleCreate}
              onCancel={() => { setShowVacancyForm(false); setEditingVacancy(null); }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default VacanciesPage; 