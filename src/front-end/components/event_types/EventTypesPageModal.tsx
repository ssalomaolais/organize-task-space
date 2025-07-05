import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EventTypesPage from "@/components/event_types/EventTypesPage";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
interface EventTypesPageModalProps {
  onCancel: () => void;
}

const EventTypesPageModal = ({ onCancel }: EventTypesPageModalProps) => {
  const [showNewForm, setShowNewForm] = useState(false);
  const handleNewStackSubmit = () => {
    setShowNewForm(true)
  };
  const handleFormComplete = () => {
    setShowNewForm(false); // Resetar após a submissão
  };
  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[85vw] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Tipo de Eventos
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1">
          <EventTypesPage showNewForm={showNewForm}
            setShowNewForm={setShowNewForm}
            />
        </div>

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

export default EventTypesPageModal;