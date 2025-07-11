
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, UserRole } from "@/types/auth";
import { toast } from "@/hooks/use-toast";

export const useUsers = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsers = async (
    page: number = 1,
    pageSize: number = 10,
    searchTerm: string = '',
    statusFilter: string = 'all'
  ) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      query = query.or(`role.ilike.%admin%,email.ilike.%super%`);

      // Apply search filter
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        const isActive = statusFilter === 'active';
        query = query.eq('active', isActive);
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      // Order by created_at
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      // Cast the data to match our Profile interface
      const typedUsers: Profile[] = (data || []).map((user: any) => ({
        ...user,
        role: user.role as UserRole
      }));

      setUsers(typedUsers);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, userData: Partial<Profile>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Cast the returned data to match our Profile interface
      const typedUser: Profile = {
        ...data,
        role: data.role as UserRole
      };

      setUsers(prev => prev.map(user => 
        user.id === userId ? typedUser : user
      ));

      toast({
        title: "Sucesso!",
        description: "Usuário atualizado com sucesso.",
      });

      return { data: typedUser, error: null };
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar usuário.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const createUser = async (userData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: 'TempPassword123!', // You might want to generate a random password
        email_confirm: true,
        user_metadata: {
          name: userData.name
        }
      });

      if (authError) throw authError;

      // Then update the profile
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          role: userData.role,
          stack: userData.stack,
          active: userData.active ?? true
        })
        .eq('id', authData.user.id)
        .select()
        .single();

      if (error) throw error;

      // Cast the returned data to match our Profile interface
      const typedUser: Profile = {
        ...data,
        role: data.role as UserRole
      };

      setUsers(prev => [typedUser, ...prev]);

      toast({
        title: "Sucesso!",
        description: "Usuário criado com sucesso.",
      });

      return { data: typedUser, error: null };
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar usuário.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  return {
    users,
    loading,
    totalCount,
    fetchUsers,
    updateUser,
    createUser
  };
};
