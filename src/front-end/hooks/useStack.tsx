import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ListValue } from "@/types/task";
import { toast } from "@/hooks/use-toast";
import { encryptData, decryptData } from "@/lib/utils";

export const useStack = () => {
  const [stack, setStack] = useState<ListValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchStack = async (
    page: number = 1,
    pageSize: number = 10,
    searchTerm: string = ''
  ) => {
    try {
      setLoading(true);
      const cacheKey = `stackCache_${page}_${pageSize}_${searchTerm}`;
      const cacheDateKey = `stackCacheDate_${page}_${pageSize}_${searchTerm}`;
      const today = new Date().toISOString().slice(0, 10);
      const cached = localStorage.getItem(cacheKey);
      const cachedDate = localStorage.getItem(cacheDateKey);
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (cached && cachedDate && key) {
        try {
          const decrypted = await decryptData(cached, key);
          const parsed = JSON.parse(decrypted);
          const decryptedDate = await decryptData(cachedDate, key);
          if (decryptedDate === today) {
            setStack(parsed.values);
            setTotalCount(parsed.count);
            setLoading(false);
            return;
          }
        } catch (e) {
          // Se falhar, ignora o cache
        }
      }
      let query = supabase
        .from('stack')
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

      const values: ListValue[] = (data || []).map((item: any) => ({
        ...item
      }));

      setStack(values);
      setTotalCount(count || 0);
      // Salvar no cache criptografado
      if (key) {
        const encrypted = await encryptData(JSON.stringify({ values, count }), key);
        const encryptedDate = await encryptData(today, key);
        localStorage.setItem(cacheKey, encrypted);
        localStorage.setItem(cacheDateKey, encryptedDate);
      }
    } catch (error) {
      console.error('Error fetching stacks:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar comunidades.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStack();
  }, []);
  
  // Função para limpar o cache local
  const clearStackCache = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('stackCache_') || key.startsWith('stackCacheDate_')) {
        localStorage.removeItem(key);
      }
    });
  };

  const createStack = async (stackData: Omit<ListValue, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('stack')
        .insert([stackData])
        .select()
        .single();

      if (error) throw error;

      setStack(prev => [...prev, data]);
      clearStackCache();
      toast({
        title: "Sucesso!",
        description: "Comunidade criada com sucesso.",
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error creating stack:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar comunidade.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateStack = async (value: string, stackData: Partial<ListValue>) => {
    try {
      const { data, error } = await supabase
        .from('stack')
        .update(stackData)
        .eq('value', value)
        .select()
        .single();

      if (error) throw error;

      setStack(prev => prev.map(item =>
        item.value === value ? data : item
      ));
      clearStackCache();
      toast({
        title: "Sucesso!",
        description: "Comunidade atualizada com sucesso.",
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error updating stack:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar comunidade.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteStack = async (value: string) => {
    try {
      const { error } = await supabase
        .from('stack')
        .delete()
        .eq('value', value);

      if (error) throw error;

      setStack(prev => prev.filter(item => item.value !== value));
      clearStackCache();
      toast({
        title: "Sucesso!",
        description: "Comunidade removida com sucesso.",
      });
      return { error: null };
    } catch (error) {
      console.error('Error deleting stack:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover comunidade.",
        variant: "destructive",
      });
      return { error };
    }
  };

  return {
    stack,
    loading,
    totalCount,
    fetchStack,
    createStack,
    updateStack,
    deleteStack,
  };
};