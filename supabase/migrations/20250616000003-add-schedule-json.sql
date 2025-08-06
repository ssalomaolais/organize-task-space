<<<<<<< HEAD
-- Add schedule JSON field to tasks table
ALTER TABLE public.tasks 
ADD COLUMN schedule JSONB DEFAULT '[]'::jsonb;

-- Create index for better performance on schedule field
CREATE INDEX idx_tasks_schedule ON public.tasks USING GIN (schedule);

-- Add comment to document the field structure
=======
-- Add schedule JSON field to tasks table
ALTER TABLE public.tasks 
ADD COLUMN schedule JSONB DEFAULT '[]'::jsonb;

-- Create index for better performance on schedule field
CREATE INDEX idx_tasks_schedule ON public.tasks USING GIN (schedule);

-- Add comment to document the field structure
>>>>>>> e14612f5b969de99aed8a28bb3b611ad29577b10
COMMENT ON COLUMN public.tasks.schedule IS 'Array of schedule objects with day, time, and instructor fields'; 