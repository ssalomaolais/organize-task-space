import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PowerPointExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (title: string) => void;
}

export const PowerPointExportModal: React.FC<PowerPointExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
}) => {
  const [title, setTitle] = useState("");

  const handleExport = () => {
    if (title.trim()) {
      onExport(title.trim());
      setTitle("");
      onClose();
    }
  };

  const handleCancel = () => {
    setTitle("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar para PowerPoint</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="presentation-title">Título da Apresentação</Label>
            <Input
              id="presentation-title"
              placeholder="Digite o título da apresentação..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleExport();
                }
              }}
            />
          </div>
          <p className="text-sm text-gray-600">
            O título será exibido no canto superior esquerdo de cada slide da apresentação.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={!title.trim()}>
            Exportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 