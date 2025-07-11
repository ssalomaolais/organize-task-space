-- Add responsibles JSON field to tasks table
ALTER TABLE public.tasks 
ADD COLUMN responsibles JSONB DEFAULT '[]'::jsonb;

-- Create index for better performance on responsibles field
CREATE INDEX idx_tasks_responsibles ON public.tasks USING GIN (responsibles);

-- Add comment to document the field structure
COMMENT ON COLUMN public.tasks.responsibles IS 'Array of responsible objects with id, name, type, and optional email fields'; 