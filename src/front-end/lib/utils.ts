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
  return TaskStatusOptions.find((t) => t.value == status).color;
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

export const getDayLabel = (dayValue: string) => {
  return DaysOfWeek.find(d => d.value === dayValue)?.label || dayValue;
};

export const TaskStatusOptions = [
  { value: "Pendente", label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  { value: "Em Andamento", label: "Em Andamento", color: "bg-blue-100 text-blue-800" },
  { value: "Completo", label: "Completo", color: "bg-green-100 text-green-800" },
  { value: "Cancelado", label: "Cancelado", color: "bg-red-100 text-red-800" },
]

export const NextEventsOptions = [
  { value: "grade", label: "Kanban" },
  { value: "calendar", label: "Calendário" },
  { value: "upcoming", label: "Próximos Eventos" },
  { value: "events-grid", label: "Apresentação" }, 
]

export const GradeLayoutOptions = [
  { value: "vertical", label: "Vertical" },
  { value: "horizontal", label: "Horizontal" },
]

export const SeniorityOptions = [
  { value: -1, label: "Não se aplica" },  
  { value: 0, label: "Jovem Aprendiz" },
  { value: 1, label: "Júnior" },
  { value: 2, label: "Pleno" },
  { value: 3, label: "Sênior" },
  { value: 4, label: "Especialista" },
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

export const DaysOfWeek = [
  { value: "monday", label: "Segunda-feira" },
  { value: "tuesday", label: "Terça-feira" },
  { value: "wednesday", label: "Quarta-feira" },
  { value: "thursday", label: "Quinta-feira" },
  { value: "friday", label: "Sexta-feira" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" }
];

export const TimeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  //"20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
];

export const RegimeOptions = [
  { value: "offsite", label: "Offsite" },
  { value: "hybrid", label: "Híbrido" },
  { value: "físico", label: "Físico" },
];

export const getRegimeOptionsLabel = (value:string):string =>{
  const found = RegimeOptions.find((e) => e.value === value);
  return found ? found.label : "";
}

export const getPreviewColorClass = (tailwindClass: string) => {
  const found = TailwindColors.find(tc => tc.value === tailwindClass);
  return found ? found.preview : "bg-gray-500"; // Fallback
}

// Funções utilitárias para criptografia AES-GCM
export async function encryptData(data: string, keyString: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(keyString),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(data)
  );
  // Retorna base64(salt + iv + encrypted)
  const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  result.set(salt, 0);
  result.set(iv, salt.length);
  result.set(new Uint8Array(encrypted), salt.length + iv.length);
  return btoa(String.fromCharCode(...result));
}

export async function decryptData(encryptedBase64: string, keyString: string): Promise<string> {
  const data = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const encrypted = data.slice(28);
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(keyString),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  );
  return new TextDecoder().decode(decrypted);
}