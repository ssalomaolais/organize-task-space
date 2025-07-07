-- Script para adicionar colunas que estão faltando na tabela tasks
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar campo responsibles como JSONB (se ainda não existir)
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS responsibles JSONB DEFAULT '[]'::jsonb;

-- 2. Adicionar colunas que estão faltando
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS student_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS vacancy_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS syllabus TEXT,
ADD COLUMN IF NOT EXISTS seniority TEXT;

-- 3. Criar índice para melhor performance no campo responsibles
CREATE INDEX IF NOT EXISTS idx_tasks_responsibles ON public.tasks USING GIN (responsibles);

-- 4. Adicionar comentários para documentar os campos
COMMENT ON COLUMN public.tasks.responsibles IS 'Array of responsible objects with id, name, type, and optional email fields';
COMMENT ON COLUMN public.tasks.student_count IS 'Number of students for training events';
COMMENT ON COLUMN public.tasks.vacancy_count IS 'Number of available vacancies';
COMMENT ON COLUMN public.tasks.syllabus IS 'Course syllabus or event description';
COMMENT ON COLUMN public.tasks.seniority IS 'Required seniority level for participants';

-- 5. Verificar se as colunas foram criadas corretamente
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
    AND column_name IN ('responsibles', 'student_count', 'vacancy_count', 'syllabus', 'seniority')
ORDER BY column_name;

-- 6. Verificar estrutura completa da tabela tasks
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
 