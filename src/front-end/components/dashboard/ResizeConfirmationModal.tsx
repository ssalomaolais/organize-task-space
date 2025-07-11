import { Task } from "@/types/task";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

interface ResizeConfirmation {
  task: Task;
  newStart: Date;
  newEnd: Date;
  info: any;
  originalStart: Date;
  originalEnd: Date;
}

interface ResizeConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  resizeConfirmation: ResizeConfirmation | null;
  onConfirm: () => void;
  onCancel: () => void;
  formatDateTime: (date: Date) => string;
  calculateDuration: (start: Date, end: Date) => string;
  convertUTCToLocal: (utcDateString: string) => Date;
}

export const ResizeConfirmationModal = ({
  isOpen,
  onOpenChange,
  resizeConfirmation,
  onConfirm,
  onCancel,
  formatDateTime,
  calculateDuration,
  convertUTCToLocal
}: ResizeConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle>Confirmar Alteração de Horário</DialogTitle>
        <DialogDescription className="space-y-4">
          {resizeConfirmation && (
            <>
              <div className="space-y-2">
                <div className="font-semibold text-lg">{resizeConfirmation.task.title}</div>
                <div className="text-sm text-gray-600">
                  <div><strong>Horário Atual:</strong></div>
                  <div>Início: {formatDateTime(convertUTCToLocal(resizeConfirmation.task.start_date))}</div>
                  <div>Fim: {formatDateTime(convertUTCToLocal(resizeConfirmation.task.end_date || resizeConfirmation.task.start_date))}</div>
                  <div>Duração: {calculateDuration(convertUTCToLocal(resizeConfirmation.task.start_date), convertUTCToLocal(resizeConfirmation.task.end_date || resizeConfirmation.task.start_date))}</div>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="text-sm text-gray-600">
                  <div><strong>Novo Horário:</strong></div>
                  <div>Início: {formatDateTime(resizeConfirmation.newStart)}</div>
                  <div>Fim: {formatDateTime(resizeConfirmation.newEnd)}</div>
                  <div>Duração: {calculateDuration(resizeConfirmation.newStart, resizeConfirmation.newEnd)}</div>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="text-sm text-blue-800">
                  <strong>⚠️ Tempo mínimo:</strong> 30 minutos
                </div>
              </div>
            </>
          )}
        </DialogDescription>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>
            Confirmar Alteração
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 