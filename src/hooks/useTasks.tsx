
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Task, ListValue } from "@/types/task";
import { toast } from "@/hooks/use-toast";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;

      // Cast the data to match our Task interface
      const typedTasks: Task[] = (data || []).map((task: any) => ({
        ...task,
        event_type: task.event_type as string
      }));

      setTasks(typedTasks);
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

  const createTask = async (taskData: Omit<Task, "id" | "created_at" | "updated_at">) => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: taskData.title,
          description: taskData.description,
          responsible: taskData.responsible,
          start_date: taskData.start_date,
          end_date: taskData.end_date,
          hours: taskData.hours,
          people: taskData.people,
          status: taskData.status,
          stack: taskData.stack,
          event_type: taskData.event_type,
          user_id: user.id // Set the user_id to the authenticated user
        }])
        .select()
        .single();

      if (error) throw error;

      // Cast the returned data to match our Task interface
      const typedTask: Task = {
        ...data,
        event_type: data.event_type as string
      };

      setTasks(prev => [...prev, typedTask]);

      toast({
        title: "Sucesso!",
        description: "Tarefa criada com sucesso.",
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar tarefa.",
        variant: "destructive",
      });
    }
  };

  const updateTask = async (taskId: string, taskData: Partial<Task>) => {
    try {
      const updateData: any = {};

      if (taskData.title) updateData.title = taskData.title;
      if (taskData.description) updateData.description = taskData.description;
      if (taskData.responsible) updateData.responsible = taskData.responsible;
      if (taskData.start_date) updateData.start_date = taskData.start_date;
      if (taskData.end_date) updateData.end_date = taskData.end_date;
      if (taskData.hours !== undefined) updateData.hours = taskData.hours;
      if (taskData.people !== undefined) updateData.people = taskData.people;
      if (taskData.status) updateData.status = taskData.status;
      if (taskData.stack) updateData.stack = taskData.stack;
      if (taskData.event_type) updateData.event_type = taskData.event_type;

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
        event_type: data.event_type as string
      };

      setTasks(prev => prev.map(task =>
        task.id === taskId ? typedTask : task
      ));

      toast({
        title: "Sucesso!",
        description: "Tarefa atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar tarefa.",
        variant: "destructive",
      });
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

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    await updateTask(taskId, { status: newStatus });
  };

  const updateTaskType = async (taskId: string, newStatus: string) => {
    await updateTask(taskId, { event_type: newStatus });
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
