import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ListValue } from "@/types/task";
import { toast } from "@/hooks/use-toast";
import { encryptData, decryptData } from "@/lib/utils";

export const useEventType = () => {
  const [eventType, setEventType] = useState<ListValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchEventType = async (
    page: number = 1,
    pageSize: number = 50,
    searchTerm: string = ''
  ) => {
    try {
      setLoading(true);
      const cacheKey = `eventTypeCache_${page}_${pageSize}_${searchTerm}`;
      const cacheDateKey = `eventTypeCacheDate_${page}_${pageSize}_${searchTerm}`;
      const today = new Date().toISOString().slice(0, 10);
      const cached = localStorage.getItem(cacheKey);
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (cached && key) {
        try {
          const decrypted = await decryptData(cached, key);
          const parsed = JSON.parse(decrypted);
          if (parsed.today === today) {
            setEventType(parsed.values);
            setTotalCount(parsed.count);
            setLoading(false);
            return;
          }
        } catch (e) {
          // Se falhar, ignora o cache
        }
      }
      let query = supabase
        .from('event_type')
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

      setEventType(values);
      setTotalCount(count || 0);
      // Salvar no cache criptografado
      if (key) {
        const encrypted = await encryptData(JSON.stringify({ today, values, count }), key);
        localStorage.setItem(cacheKey, encrypted);
      }
    } catch (error) {
      console.error('Error fetching event_type:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar tipos de evento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventType();
  }, []);

  // Função para limpar o cache local
  const clearEventTypeCache = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('eventTypeCache_') || key.startsWith('eventTypeCacheDate_')) {
        localStorage.removeItem(key);
      }
    });
  };

  const createEventType = async (eventData: Omit<ListValue, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('event_type')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;

      setEventType(prev => [...prev, data]);
      clearEventTypeCache();
      toast({
        title: "Sucesso!",
        description: "Tipo de evento criado com sucesso.",
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error creating event type:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar tipo de evento.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateEventType = async (value: string, eventData: Partial<ListValue>) => {
    try {
      const { data, error } = await supabase
        .from('event_type')
        .update(eventData)
        .eq('value', value)
        .select()
        .single();

      if (error) throw error;

      setEventType(prev => prev.map(item =>
        item.value === value ? data : item
      ));
      clearEventTypeCache();
      toast({
        title: "Sucesso!",
        description: "Tipo de evento atualizado com sucesso.",
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error updating event type:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar tipo de evento.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteEventType = async (value: string) => {
    try {
      const { error } = await supabase
        .from('event_type')
        .delete()
        .eq('value', value);

      if (error) throw error;

      setEventType(prev => prev.filter(item => item.value !== value));
      clearEventTypeCache();
      toast({
        title: "Sucesso!",
        description: "Tipo de evento removido com sucesso.",
      });
      return { error: null };
    } catch (error) {
      console.error('Error deleting event type:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover tipo de evento.",
        variant: "destructive",
      });
      return { error };
    }
  };

  return {
    eventType,
    loading,
    totalCount,
    fetchEventType,
    createEventType,
    updateEventType,
    deleteEventType,
  };
};