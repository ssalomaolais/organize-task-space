import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Profile } from "@/types/auth";
import { ListValue } from "@/types/task";
import ResponsibleList from "@/components/task/ResponsibleList";
import { Responsible } from "@/types/task";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserGeneralTab from "@/components/users/UserGeneralTab";
import UserResponsiblesTab from "@/components/users/UserResponsiblesTab";

interface UserFormProps {
  user?: Profile | null;
  stack: ListValue[] | [];
  onSubmit: (userData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const UserForm = ({ user, stack, onSubmit, onCancel }: UserFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user',
    stack: '',
    active: true,
    responsibles: [] as Responsible[],
  });

  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        stack: user.stack || '',
        active: user.active ?? true,
        responsibles: user.responsibles || [],
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleResponsiblesChange = (responsibles: Responsible[]) => {
    setFormData(prev => ({ ...prev, responsibles }));
  };

  const isEditing = !!user;

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:min-w-[900px] min-h-[600px] flex flex-col !justify-start !items-start overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col flex-1">
          <TabsContent value="general" className="flex-1 !mt-0">
            <UserGeneralTab
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
              onCancel={onCancel}
              onSubmit={handleSubmit}
              stack={stack}
            />
          </TabsContent>
          <TabsContent value="responsibles" className="flex-1 !mt-0">
            <UserResponsiblesTab
              responsibles={formData.responsibles}
              onResponsiblesChange={handleResponsiblesChange}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
