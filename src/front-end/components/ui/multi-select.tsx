import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showAllOption?: boolean;
  allOptionLabel?: string;
}

export function MultiSelect({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Selecione...",
  className,
  disabled = false,
  showAllOption = false,
  allOptionLabel = "Todas as opções"
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Validações para evitar erros
  const safeOptions = Array.isArray(options) ? options : [];
  const safeSelectedValues = Array.isArray(selectedValues) ? selectedValues : [];

  const handleSelect = (value: string) => {
    if (value === "all") {
      // Se selecionar "Todas as opções", desmarca todas as outras
      onSelectionChange([]);
    } else {
      let newSelection: string[];
      
      if (safeSelectedValues.includes(value)) {
        // Remove o valor se já estiver selecionado
        newSelection = safeSelectedValues.filter(v => v !== value);
      } else {
        // Adiciona o valor se não estiver selecionado
        newSelection = [...safeSelectedValues, value];
      }
      
      onSelectionChange(newSelection);
    }
  };



  const selectedOptions = safeOptions.filter(option => safeSelectedValues.includes(option.value));
  const displayText = selectedOptions.length > 0 
    ? `${selectedOptions.length} selecionado${selectedOptions.length > 1 ? 's' : ''}`
    : placeholder;

  // Filtrar opções baseado no termo de busca
  const filteredOptions = safeOptions.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-black",
            className
          )}
          disabled={disabled}
        >
          <span className="truncate">{displayText}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="flex flex-col">
          {/* Campo de busca */}
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          
          {/* Lista de opções */}
          <div className="max-h-64 overflow-y-auto">
            {showAllOption && (
              <div
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSelect("all")}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    safeSelectedValues.length === 0 ? "opacity-100" : "opacity-0"
                  )}
                />
                {allOptionLabel}
              </div>
            )}
            
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Nenhuma opção encontrada.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      safeSelectedValues.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
      

    </Popover>
  );
} 