import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Task, ListValue } from "@/types/task";
import { toast } from "@/hooks/use-toast";
import { encryptData, decryptData } from "@/lib/utils";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const cacheKey = `tasksCache`;
      const cacheDateKey = `tasksCacheDate`;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const cached = localStorage.getItem(cacheKey);
      const cachedDate = localStorage.getItem(cacheDateKey);
      const now = Date.now();
      if (cached && cachedDate && key) {
        try {
          const decrypted = await decryptData(cached, key);
          const parsed = JSON.parse(decrypted);
          const decryptedDate = await decryptData(cachedDate, key);
          if (now - Number(decryptedDate) < 10 * 60 * 1000) { // 10 minutos
            setTasks(parsed.tasks);
            setLoading(false);
            return;
          }
        } catch (e) {
          // Se falhar, ignora o cache
        }
      }
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('start_date', { ascending: true });
      if (error) throw error;
      // Cast the data to match our Task interface
      const typedTasks: Task[] = (data || []).map((task: any) => ({
        ...task,
        event_type: task.event_type as string,
        responsibles: task.responsibles || [],
        schedule: task.schedule || []
      }));
      setTasks(typedTasks);
      // Salvar no cache criptografado
      if (key) {
        const encrypted = await encryptData(JSON.stringify({ tasks: typedTasks }), key);
        const encryptedDate = await encryptData(String(now), key);
        localStorage.setItem(cacheKey, encrypted);
        localStorage.setItem(cacheDateKey, encryptedDate);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar tarefas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Função para limpar o cache local de tasks
  const clearTasksCache = () => {
    localStorage.removeItem('tasksCache');
    localStorage.removeItem('tasksCacheDate');
  };

  const createTask = async (taskData: Omit<Task, "id" | "created_at" | "updated_at">): Promise<{ success: boolean; error?: string }> => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Debug log para verificar se o schedule está sendo enviado
      console.log('Creating task with schedule:', taskData.schedule);

      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: taskData.title,
          subtitle: taskData.subtitle,
          description: taskData.description,
          responsible: taskData.responsible,
          start_date: taskData.start_date,
          end_date: taskData.end_date,
          hours: taskData.hours,
          people: taskData.people,
          status: taskData.status,
          stack: taskData.stack,
          event_type: taskData.event_type,
          responsibles: taskData.responsibles || [],
          student_count: taskData.student_count,
          vacancy_count: taskData.vacancy_count,
          syllabus: taskData.syllabus,
          seniority: taskData.seniority,
          schedule: taskData.schedule || [],
          user_id: user.id // Set the user_id to the authenticated user
        }])
        .select()
        .single();

      if (error) throw error;

      // Debug log para verificar se o schedule foi retornado
      console.log('Task created, returned schedule:', data.schedule);

      // Cast the returned data to match our Task interface
      const typedTask: Task = {
        ...data,
        event_type: data.event_type as string,
        responsibles: data.responsibles || [],
        schedule: data.schedule || []
      };

      setTasks(prev => [...prev, typedTask]);
      clearTasksCache();
      toast({
        title: "Sucesso!",
        description: "Tarefa criada com sucesso.",
      });

      return { success: true };
    } catch (error) {
      console.error('Error creating task:', error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar tarefa.";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  const updateTask = async (taskId: string, taskData: Partial<Task>): Promise<{ success: boolean; error?: string }> => {
    try {
      const updateData: any = {};

      if (taskData.title) updateData.title = taskData.title;
      if (taskData.subtitle) updateData.subtitle = taskData.subtitle;      
      if (taskData.description) updateData.description = taskData.description;
      if (taskData.responsible) updateData.responsible = taskData.responsible;
      if (taskData.start_date) updateData.start_date = taskData.start_date;
      if (taskData.end_date) updateData.end_date = taskData.end_date;
      if (taskData.hours !== undefined) updateData.hours = taskData.hours;
      if (taskData.people !== undefined) updateData.people = taskData.people;
      if (taskData.status) updateData.status = taskData.status;
      if (taskData.stack) updateData.stack = taskData.stack;
      if (taskData.event_type) updateData.event_type = taskData.event_type;
      if (taskData.responsibles !== undefined) updateData.responsibles = taskData.responsibles;
      if (taskData.student_count !== undefined) updateData.student_count = taskData.student_count;
      if (taskData.vacancy_count !== undefined) updateData.vacancy_count = taskData.vacancy_count;
      if (taskData.syllabus !== undefined) updateData.syllabus = taskData.syllabus;
      if (taskData.seniority !== undefined) updateData.seniority = taskData.seniority;
      if (taskData.schedule !== undefined) updateData.schedule = taskData.schedule;

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      // Cast the returned data to match our Task interface
      const typedTask: Task = {
        ...data,
        event_type: data.event_type as string,
        responsibles: data.responsibles || [],
        schedule: data.schedule || []
      };

      setTasks(prev => prev.map(task =>
        task.id === taskId ? typedTask : task
      ));
      clearTasksCache();
      toast({
        title: "Sucesso!",
        description: "Tarefa atualizada com sucesso.",
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating task:', error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao atualizar tarefa.";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
      clearTasksCache();
      toast({
        title: "Sucesso!",
        description: "Tarefa removida com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover tarefa.",
        variant: "destructive",
      });
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string): Promise<{ success: boolean; error?: string }> => {
    return await updateTask(taskId, { status: newStatus });
  };

  const updateTaskType = async (taskId: string, newStatus: string): Promise<{ success: boolean; error?: string }> => {
    return await updateTask(taskId, { event_type: newStatus });
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskType,
    refetch: fetchTasks,
  };
};
