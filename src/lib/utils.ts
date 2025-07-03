// src/lib/utils.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFormatDate = (data:string) =>{
  const formattedStartDate = new Date(data).toISOString().slice(0, 16)
  //const formattedStartDate = data ? new Date(data).toISOString().split('T')[0] : ''

    return formattedStartDate;
}

export const getStatusColor = (status) => {
  return TaskStatus.find((t) => t.value == status).color;
}

export const getMonthName = (month: number) => {
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  return months[month - 1];
}

export const getMonthFromDate = (dateString: string) => {
  const date = new Date(dateString);
  return (date.getMonth() + 1);
}

export const getSemesterFromDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  return month <= 6 ? 1 : 2;
}

export const getSemesterName = (semester: number) => {
  return semester === 1 ? "1º Semestre" : "2º Semestre";
}

export const TaskStatus = [
  { value: "Pendente", label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  { value: "Em Andamento", label: "Em Andamento", color: "bg-blue-100 text-blue-800" },
  { value: "Completo", label: "Completo", color: "bg-green-100 text-green-800" },
  { value: "Cancelado", label: "Cancelado", color: "bg-red-100 text-red-800" },
]

export const NextEvents = [
  { value: "semester", label: "Vertical" },
  { value: "year", label: "Horizontal" },
  { value: "calendar", label: "Calendário" },
  { value: "upcoming", label: "Próximos Eventos" },
  { value: "events-grid", label: "Grade de Eventos" }, 
]

export const TailwindColors = [
  { value: "bg-gray-100 text-gray-800", label: "Cinza", preview: "bg-gray-500" },
  { value: "bg-red-100 text-red-800", label: "Vermelho", preview: "bg-red-500" },
  { value: "bg-yellow-100 text-yellow-800", label: "Amarelo", preview: "bg-yellow-500" },
  { value: "bg-green-100 text-green-800", label: "Verde", preview: "bg-green-500" },
  { value: "bg-blue-100 text-blue-800", label: "Azul", preview: "bg-blue-500" },
  { value: "bg-indigo-100 text-indigo-800", label: "Índigo", preview: "bg-indigo-500" },
  { value: "bg-purple-100 text-purple-800", label: "Roxo", preview: "bg-purple-500" },
  { value: "bg-pink-100 text-pink-800", label: "Rosa", preview: "bg-pink-500" },
  { value: "bg-orange-100 text-orange-800", label: "Laranja", preview: "bg-orange-500" },
  { value: "bg-teal-100 text-teal-800", label: "Verde-azulado", preview: "bg-teal-500" },
]

export const getPreviewColorClass = (tailwindClass: string) => {
  const found = TailwindColors.find(tc => tc.value === tailwindClass);
  return found ? found.preview : "bg-gray-500"; // Fallback
}