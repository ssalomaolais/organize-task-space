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
  { value: "FT", label: "Forum Técnico" },
  { value: "MI", label: "Meetup Interno" },
  { value: "ME", label: "Meetup Externo" },
  { value: "TI", label: "Techup Interno" },
  { value: "TE", label: "Techup Externo" },
  { value: "ON", label: "Onboarding" },
  { value: "Outros", label: "Outros" }
];