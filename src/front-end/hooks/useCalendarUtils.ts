import { ListValue } from "@/types/task";

export const useCalendarUtils = (eventType: ListValue[]) => {
  const getEventTypeColor = (eventTypeValue: string) => {
    const colorClass = eventType.find((et) => et.value === eventTypeValue)?.color || "bg-gray-100 text-gray-800";
    
    // Mapear classes Tailwind para cores hexadecimais
    const colorMap: { [key: string]: { bg: string; text: string } } = {
      "bg-red-100 text-red-800": { bg: "#fef2f2", text: "#991b1b" },
      "bg-orange-100 text-orange-800": { bg: "#fff7ed", text: "#9a3412" },
      "bg-yellow-100 text-yellow-800": { bg: "#fefce8", text: "#92400e" },
      "bg-green-100 text-green-800": { bg: "#f0fdf4", text: "#166534" },
      "bg-blue-100 text-blue-800": { bg: "#eff6ff", text: "#1e40af" },
      "bg-indigo-100 text-indigo-800": { bg: "#eef2ff", text: "#3730a3" },
      "bg-purple-100 text-purple-800": { bg: "#faf5ff", text: "#5b21b6" },
      "bg-pink-100 text-pink-800": { bg: "#fdf2f8", text: "#9d174d" },
      "bg-gray-100 text-gray-800": { bg: "#f3f4f6", text: "#1f2937" },
      "bg-slate-100 text-slate-800": { bg: "#f1f5f9", text: "#1e293b" },
      "bg-zinc-100 text-zinc-800": { bg: "#f4f4f5", text: "#27272a" },
      "bg-neutral-100 text-neutral-800": { bg: "#f5f5f5", text: "#262626" },
      "bg-stone-100 text-stone-800": { bg: "#f5f5f4", text: "#292524" },
      "bg-emerald-100 text-emerald-800": { bg: "#ecfdf5", text: "#065f46" },
      "bg-teal-100 text-teal-800": { bg: "#f0fdfa", text: "#115e59" },
      "bg-cyan-100 text-cyan-800": { bg: "#ecfeff", text: "#155e75" },
      "bg-sky-100 text-sky-800": { bg: "#f0f9ff", text: "#075985" },
      "bg-violet-100 text-violet-800": { bg: "#f5f3ff", text: "#5b21b6" },
      "bg-fuchsia-100 text-fuchsia-800": { bg: "#fdf4ff", text: "#86198f" },
      "bg-rose-100 text-rose-800": { bg: "#fff1f2", text: "#9f1239" },
    };
    
    return colorMap[colorClass] || { bg: "#f3f4f6", text: "#1f2937" };
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const validateMinimumDuration = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes >= 30;
  };

  const formatDateForStorage = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
  };

  const convertUTCToLocal = (utcDateString: string) => {
    // Parse a data UTC
    const utcDate = new Date(utcDateString);
    
    // Cria uma nova data local com os mesmos componentes UTC
    const localDate = new Date(
      utcDate.getUTCFullYear(),
      utcDate.getUTCMonth(),
      utcDate.getUTCDate(),
      utcDate.getUTCHours(),
      utcDate.getUTCMinutes(),
      utcDate.getUTCSeconds()
    );
    
    return localDate;
  };

  return {
    getEventTypeColor,
    formatDateTime,
    calculateDuration,
    validateMinimumDuration,
    formatDateForStorage,
    convertUTCToLocal
  };
}; 