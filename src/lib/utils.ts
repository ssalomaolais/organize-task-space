import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusColor = (status) => {
  return TaskStatus.find((t)=> t.value ==status).color;
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
  { value: "Pendente", label: "Pendente", color:"bg-yellow-100 text-yellow-800"},
  { value: "Em Andamento", label: "Em Andamento", color:"bg-blue-100 text-blue-800" },
  { value: "Completo", label: "Completo", color:"bg-green-100 text-green-800" },
  { value: "Cancelado", label: "Cancelado", color:"bg-red-100 text-red-800" }
];

export const TypeOptions = [
  { value: "Forum Técnico", label: "Forum Técnico" },
  { value: "Meetup Interno", label: "Meetup Interno" },
  { value: "Meetup Externo", label: "Meetup Externo" },
  { value: "Techup Interno", label: "Techup Interno" },
  { value: "Techup Externo", label: "Techup Externo" },
  { value: "Outros", label: "Outros" }
];