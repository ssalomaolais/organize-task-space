import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Vacancy } from "@/types/task";
import { toast } from "@/hooks/use-toast";

export const useVacancies = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchVacancies = async (
    page: number = 1,
    pageSize: number = 10,
    searchTerm: string = ""
  ) => {
    try {
      setLoading(true);
      let query = supabase
        .from("vacancy")
        .select("*", { count: "exact" });

      if (searchTerm) {
        query = query.or(
          `title.ilike.%${searchTerm}%,teams.ilike.%${searchTerm}%,local.ilike.%${searchTerm}%`
        );
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      query = query.order("created_at", { ascending: false });

      const { data, error, count } = await query;
      if (error) throw error;
      setVacancies(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching vacancies:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar vagas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createVacancy = async (vacancyData: Omit<Vacancy, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from("vacancy")
        .insert([vacancyData])
        .select()
        .single();
      if (error) throw error;
      setVacancies((prev) => [data, ...prev]);
      toast({
        title: "Sucesso!",
        description: "Vaga criada com sucesso.",
      });
      return { data, error: null };
    } catch (error) {
      console.error("Error creating vacancy:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar vaga.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateVacancy = async (vacancyId: string, vacancyData: Partial<Vacancy>) => {
    try {
      const { data, error } = await supabase
        .from("vacancy")
        .update(vacancyData)
        .eq("id", vacancyId)
        .select()
        .single();
      if (error) throw error;
      setVacancies((prev) => prev.map((v) => (v.id === vacancyId ? data : v)));
      toast({
        title: "Sucesso!",
        description: "Vaga atualizada com sucesso.",
      });
      return { data, error: null };
    } catch (error) {
      console.error("Error updating vacancy:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar vaga.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteVacancy = async (vacancyId: string) => {
    try {
      const { error } = await supabase
        .from("vacancy")
        .delete()
        .eq("id", vacancyId);
      if (error) throw error;
      setVacancies((prev) => prev.filter((v) => v.id !== vacancyId));
      toast({
        title: "Sucesso!",
        description: "Vaga excluída com sucesso.",
      });
      return { error: null };
    } catch (error) {
      console.error("Error deleting vacancy:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir vaga.",
        variant: "destructive",
      });
      return { error };
    }
  };

  return {
    vacancies,
    loading,
    totalCount,
    fetchVacancies,
    createVacancy,
    updateVacancy,
    deleteVacancy,
  };
}; 