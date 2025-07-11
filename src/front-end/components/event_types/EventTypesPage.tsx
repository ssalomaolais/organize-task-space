import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {  Edit, Trash2} from "lucide-react";
import { useEventType } from "@/hooks/useEventType";
import { ListValue } from "@/types/task";
import EventTypeForm from "./EventTypeForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {  getPreviewColorClass } from "@/lib/utils";
import {Loading} from "../shared/loading";

interface EventTypesPageProps {
  showNewForm: boolean;
  setShowNewForm: (boolean) => void;
  onDataChanged?: () => void;
}

const EventTypesPage = ({showNewForm, setShowNewForm, onDataChanged}:EventTypesPageProps) => {
  const { eventType, loading, totalCount, fetchEventType, createEventType, updateEventType, deleteEventType } = useEventType();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [editingItem, setEditingItem] = useState<ListValue | null>(null);
  const [deletingItemValue, setDeletingItemValue] = useState<string | null>(null);

  useEffect(() => {
    fetchEventType(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value));
    setCurrentPage(1);
  };

  const handleCreate = async (itemData: Omit<ListValue, 'id'>) => {
    const result = await createEventType(itemData);
    if (result.data) {
      setShowNewForm(false);
      fetchEventType(currentPage, pageSize, searchTerm);
      if (onDataChanged) onDataChanged();
    }
  };

  const handleUpdate = async (itemData: Omit<ListValue, 'id'>) => {
    if (!editingItem) return;
    const result = await updateEventType(editingItem.value, itemData);
    if (result.data) {
      setEditingItem(null);
      setShowNewForm(false); // Add this line to close the form
      fetchEventType(currentPage, pageSize, searchTerm);
      if (onDataChanged) onDataChanged();
    }
  };

  const handleDelete = async () => {
    if (deletingItemValue) {
      await deleteEventType(deletingItemValue);
      setDeletingItemValue(null);
      fetchEventType(currentPage, pageSize, searchTerm);
      if (onDataChanged) onDataChanged();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Content */}
      <div className="p-0">
        <Card>

          <CardContent>
            {loading ? (
              <Loading loading={loading} />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Identificador</TableHead>
                      <TableHead>Cor</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventType.map((item) => (
                      <TableRow key={item.value}>
                        <TableCell className="font-medium">{item.label}</TableCell>
                        <TableCell>{item.value}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${getPreviewColorClass(item.color)}`}></div>
                            <span className="text-xs">{item.color}</span> {/* Display the full class name */}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setEditingItem(item);
                              setShowNewForm(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => setDeletingItemValue(item.value)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Isso removerá permanentemente o tipo de evento "{item.label}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeletingItemValue(null)}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>Continuar</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Modal */}
      {showNewForm && (
        <EventTypeForm
          eventType={editingItem}
          onSubmit={editingItem ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowNewForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

export default EventTypesPage;