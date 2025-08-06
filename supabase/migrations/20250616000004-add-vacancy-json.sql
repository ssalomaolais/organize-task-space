-- Add vacancy JSON field to tasks table
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS vacancy jsonb;

COMMENT ON COLUMN public.tasks.vacancy IS 'Vacancy information: regime (offsite, hybrid), conhecimentos (array of {knowledge, required|desired})'; 