-- Add schedule JSON field to tasks table
ALTER TABLE public.tasks 
ADD COLUMN schedule JSONB DEFAULT '[]'::jsonb;

-- Create index for better performance on schedule field
CREATE INDEX idx_tasks_schedule ON public.tasks USING GIN (schedule);

-- Add comment to document the field structure
COMMENT ON COLUMN public.tasks.schedule IS 'Array of schedule objects with day, time, and instructor fields'; 