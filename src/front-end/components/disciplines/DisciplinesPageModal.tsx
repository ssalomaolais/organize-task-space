import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DisciplinesPage from "@/components/disciplines/DisciplinesPage";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface DisciplinesPageModalProps {
  onCancel: () => void;
  onDataChanged?: () => void;
}

const DisciplinesPageModal = ({ onCancel, onDataChanged }: DisciplinesPageModalProps) => {
  const [showNewForm, setShowNewForm] = useState(false);
  
  const handleNewDisciplineSubmit = () => {
    setShowNewForm(true)
  };
  
  const handleFormComplete = () => {
    setShowNewForm(false); // Resetar após a submissão
  };
  
  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[825px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Disciplinas
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1">
          <DisciplinesPage showNewForm={showNewForm}
            setShowNewForm={setShowNewForm}
            onDataChanged={onDataChanged}
            />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline"
            onClick={handleNewDisciplineSubmit}
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

export default DisciplinesPageModal; 