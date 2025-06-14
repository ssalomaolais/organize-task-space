
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task";
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

      const formattedTasks = data?.map(task => ({
        ...task,
        startDate: task.start_date,
        endDate: task.end_date,
        eventType: task.event_type,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      })) || [];

      setTasks(formattedTasks);
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

  const createTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: taskData.title,
          description: taskData.description,
          responsible: taskData.responsible,
          start_date: taskData.startDate,
          end_date: taskData.endDate,
          hours: taskData.hours,
          people: taskData.people,
          status: taskData.status,
          stack: taskData.stack,
          event_type: taskData.eventType
        }])
        .select()
        .single();

      if (error) throw error;

      const newTask = {
        ...data,
        startDate: data.start_date,
        endDate: data.end_date,
        eventType: data.event_type,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setTasks(prev => [...prev, newTask]);
      
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
      if (taskData.startDate) updateData.start_date = taskData.startDate;
      if (taskData.endDate) updateData.end_date = taskData.endDate;
      if (taskData.hours !== undefined) updateData.hours = taskData.hours;
      if (taskData.people !== undefined) updateData.people = taskData.people;
      if (taskData.status) updateData.status = taskData.status;
      if (taskData.stack) updateData.stack = taskData.stack;
      if (taskData.eventType) updateData.event_type = taskData.eventType;

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      const updatedTask = {
        ...data,
        startDate: data.start_date,
        endDate: data.end_date,
        eventType: data.event_type,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
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

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    refetch: fetchTasks
  };
};
