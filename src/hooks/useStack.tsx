
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ListValue } from "@/types/task";
import { toast } from "@/hooks/use-toast";

export const useStack = () => {
  const [stack, setStack] = useState<ListValue[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStack = async () => {
    try {
      const { data, error } = await supabase
        .from('stack')
        .select('*')

      if (error) throw error;

      const values: ListValue[] = (data || []).map((item: any) => ({
        ...item
      }));

      setStack(values);
    } catch (error) {
      console.error('Error fetching stasks:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar stasks.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStack();
  }, []);
  
  return {
    stack,
    loading,
    fetchStack,
  };
};
