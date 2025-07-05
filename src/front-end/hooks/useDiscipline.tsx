import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ListValue } from "@/types/task";
import { toast } from "@/hooks/use-toast";

export const useDiscipline = () => {
  const [discipline, setDiscipline] = useState<ListValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchDiscipline = async (
    page: number = 1,
    pageSize: number = 50,
    searchTerm: string = ''
  ) => {
    try {
      setLoading(true);
      let query = supabase
        .from('discipline')
        .select('*', { count: 'exact' });

      if (searchTerm) {
        query = query.or(`label.ilike.%${searchTerm}%,value.ilike.%${searchTerm}%`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      query = query.order('label', { ascending: true });

      const { data, error, count } = await query;

      if (error) throw error;

      const values: ListValue[] = (data || []).map((item: ListValue) => ({
        ...item
      }));

      setDiscipline(values);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching discipline:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar disciplinas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscipline();
  }, []);

  const createDiscipline = async (disciplineData: Omit<ListValue, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('discipline')
        .insert([disciplineData])
        .select()
        .single();

      if (error) throw error;

      setDiscipline(prev => [...prev, data]);
      toast({
        title: "Sucesso!",
        description: "Disciplina criada com sucesso.",
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error creating discipline:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar disciplina.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateDiscipline = async (value: string, disciplineData: Partial<ListValue>) => {
    try {
      const { data, error } = await supabase
        .from('discipline')
        .update(disciplineData)
        .eq('value', value)
        .select()
        .single();

      if (error) throw error;

      setDiscipline(prev => prev.map(item =>
        item.value === value ? data : item
      ));
      toast({
        title: "Sucesso!",
        description: "Disciplina atualizada com sucesso.",
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error updating discipline:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar disciplina.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteDiscipline = async (value: string) => {
    try {
      const { error } = await supabase
        .from('discipline')
        .delete()
        .eq('value', value);

      if (error) throw error;

      setDiscipline(prev => prev.filter(item => item.value !== value));
      toast({
        title: "Sucesso!",
        description: "Disciplina removida com sucesso.",
      });
      return { error: null };
    } catch (error) {
      console.error('Error deleting discipline:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover disciplina.",
        variant: "destructive",
      });
      return { error };
    }
  };

  return {
    discipline,
    loading,
    totalCount,
    fetchDiscipline,
    createDiscipline,
    updateDiscipline,
    deleteDiscipline,
  };
}; 