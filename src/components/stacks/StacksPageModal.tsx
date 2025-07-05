import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StacksPage from "@/components/stacks/StacksPage";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface StackFormModalProps {
  onCancel: () => void;
}

const StacksPageModal = ({ onCancel }: StackFormModalProps) => {
  const [showNewForm, setShowNewForm] = useState<boolean>(false);
  const handleNewStackSubmit = () => {
    setShowNewForm(true)
  };
  return (
    <Dialog open={true} onOpenChange={() => {
      onCancel();
      setShowNewForm(false); // Resetar ao fechar
    }}>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>
            Comunidade
          </DialogTitle>
        </DialogHeader>
        <StacksPage showNewForm={showNewForm} setShowNewForm={setShowNewForm}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline"
            onClick={handleNewStackSubmit}
            disabled={showNewForm} // Desabilita se já estiver mostrando o form
          >
            <Plus className="w-4 h-4" />
            Novo
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StacksPageModal;