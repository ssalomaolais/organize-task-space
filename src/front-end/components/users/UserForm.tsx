import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Profile } from "@/types/auth";
import { ListValue } from "@/types/task";
import { Responsible } from "@/types/task";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserGeneralTab from "@/components/users/UserGeneralTab";

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
    role: '',
    stack: '',
    active: true,
  });

  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        stack: user.stack || '',
        active: user.active ?? true
    });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!user;

  console.log("user:", user);
  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:min-w-[900px] min-h-[500px] flex flex-col !justify-start !items-start overflow-y-auto">
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
