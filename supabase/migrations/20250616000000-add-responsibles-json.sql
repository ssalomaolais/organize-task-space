<<<<<<< HEAD
-- Add responsibles JSON field to tasks table
ALTER TABLE public.tasks 
ADD COLUMN responsibles JSONB DEFAULT '[]'::jsonb;

-- Create index for better performance on responsibles field
CREATE INDEX idx_tasks_responsibles ON public.tasks USING GIN (responsibles);

-- Add comment to document the field structure
=======
-- Add responsibles JSON field to tasks table
ALTER TABLE public.tasks 
ADD COLUMN responsibles JSONB DEFAULT '[]'::jsonb;

-- Create index for better performance on responsibles field
CREATE INDEX idx_tasks_responsibles ON public.tasks USING GIN (responsibles);

-- Add comment to document the field structure
>>>>>>> e14612f5b969de99aed8a28bb3b611ad29577b10
COMMENT ON COLUMN public.tasks.responsibles IS 'Array of responsible objects with id, name, type, and optional email fields'; 