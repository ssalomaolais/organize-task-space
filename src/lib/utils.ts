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
};

export const getMonthName = (month: number) => {
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  return months[month - 1];
};

export const getMonthFromDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.getMonth() + 1;
};

export const getSemesterFromDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  return month <= 6 ? 1 : 2;
};

export const getSemesterName = (semester: number) => {
  return semester === 1 ? "1º Semestre" : "2º Semestre";
};

export const Stacks = [
  { value: "all", label: "Todas Stacks", color: "" },
  { value: "Front", label: "Front", color: "bg-green-100 text-green-800" },
  { value: "Java", label: "Java", color: "bg-orange-100 text-orange-800" },
  { value: ".NET", label: ".NET", color: "bg-purple-100 text-purple-800" },
  { value: "TEC", label: "Tec. Digitais", color: "bg-blue-100 text-blue-800" },
  { value: "Dados", label: "Dados", color: "bg-yellow-100 text-yellow-800" },
  { value: "IA", label: "IA", color: "bg-yellow-100 text-yellow-800" },
];

export const TaskStatus = [
  { value: "Pendente", label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  { value: "Em Andamento", label: "Em Andamento", color: "bg-blue-100 text-blue-800" },
  { value: "Completo", label: "Completo", color: "bg-green-100 text-green-800" },
  { value: "Cancelado", label: "Cancelado", color: "bg-red-100 text-red-800" },
];

export const TypeOptions = [
  { value: "all", label: "Todos" },
  { value: "FT", label: "Forum Técnico" },
  { value: "MI", label: "Meetup Interno" },
  { value: "ME", label: "Meetup Externo" },
  { value: "TI", label: "Techup Interno" },
  { value: "TE", label: "Techup Externo" },
  { value: "ON", label: "Onboarding" },
  { value: "Outros", label: "Outros" },
];
