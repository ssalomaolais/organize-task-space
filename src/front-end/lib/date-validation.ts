import { toast } from "@/hooks/use-toast";

/**
 * Valida se uma data não é anterior ao ano 2000
 * @param date - Data a ser validada
 * @param fieldName - Nome do campo para exibir na mensagem de erro
 * @returns true se a data é válida, false caso contrário
 */
export function validateDateNotBefore2000(date: Date, fieldName: string = "data"): boolean {
  if (date.getFullYear() < 2000) {
    toast({
      title: "Erro de Data",
      description: `A ${fieldName} não pode ser anterior ao ano 2000. Por favor, selecione uma data válida.`,
      variant: "destructive",
    });
    return false;
  }
  return true;
}

/**
 * Valida se a data de fim é posterior à data de início
 * @param startDate - Data de início
 * @param endDate - Data de fim
 * @returns true se a validação passa, false caso contrário
 */
export function validateEndDateAfterStartDate(startDate: Date, endDate: Date): boolean {
  if (endDate <= startDate) {
    toast({
      title: "Erro de Data/Hora",
      description: "A data e hora de fim deve ser posterior à data e hora de início.",
      variant: "destructive",
    });
    return false;
  }
  return true;
}

/**
 * Validação completa de datas para tarefas
 * @param startDate - Data de início
 * @param endDate - Data de fim
 * @returns true se todas as validações passam, false caso contrário
 */
export function validateTaskDates(startDate: Date, endDate: Date): boolean {
  // Validar se as datas não são anteriores a 2000
  if (!validateDateNotBefore2000(startDate, "data de início")) {
    return false;
  }
  
  if (!validateDateNotBefore2000(endDate, "data de fim")) {
    return false;
  }
  
  // Validar se a data de fim é posterior à data de início
  if (!validateEndDateAfterStartDate(startDate, endDate)) {
    return false;
  }
  
  return true;
}

/**
 * Valida se uma string de data é válida
 * @param dateString - String da data no formato ISO
 * @returns true se a data é válida, false caso contrário
 */
export function validateDateString(dateString: string): boolean {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    toast({
      title: "Erro de Data",
      description: "Formato de data/hora inválido. Por favor, use o formato AAAA-MM-DDTHH:mm.",
      variant: "destructive",
    });
    return false;
  }
  return true;
} 