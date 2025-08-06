-- Add missing columns to tasks table
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS student_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS vacancy_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS syllabus TEXT,
ADD COLUMN IF NOT EXISTS seniority TEXT;

-- Add comments to document the new fields
COMMENT ON COLUMN public.tasks.student_count IS 'Number of students for training events';
COMMENT ON COLUMN public.tasks.vacancy_count IS 'Number of available vacancies';
COMMENT ON COLUMN public.tasks.syllabus IS 'Course syllabus or event description';
COMMENT ON COLUMN public.tasks.seniority IS 'Required seniority level for participants'; 