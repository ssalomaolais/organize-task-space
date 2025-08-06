<<<<<<< HEAD
-- Add vacancy JSON field to tasks table
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS vacancy jsonb;

=======
-- Add vacancy JSON field to tasks table
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS vacancy jsonb;

>>>>>>> e14612f5b969de99aed8a28bb3b611ad29577b10
COMMENT ON COLUMN public.tasks.vacancy IS 'Vacancy information: regime (offsite, hybrid), conhecimentos (array of {knowledge, required|desired})'; 