
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ListValue } from "@/types/task";
import { toast } from "@/hooks/use-toast";

export const useEventType = () => {
  const [eventType, setEventType] = useState<ListValue[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEventType = async () => {
    try {
      const { data, error } = await supabase
        .from('event_type')
        .select('*')

      if (error) throw error;

      const values: ListValue[] = (data || []).map((item: any) => ({
        ...item
      }));

      setEventType(values);
    } catch (error) {
      console.error('Error fetching event_type:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar event_type.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventType();
  }, []);


  return {
    eventType,
    loading,
    fetchEventType,
  };
};
