
-- Remove the existing insert policy
DROP POLICY IF EXISTS "Authenticated users can create tasks" ON public.tasks;

-- Create a new insert policy that ensures user_id is set to the authenticated user
CREATE POLICY "Users can create their own tasks" ON public.tasks
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Also ensure users can only update their own tasks
DROP POLICY IF EXISTS "Users can update tasks" ON public.tasks;

CREATE POLICY "Users can update their own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Make sure user_id is not nullable to prevent RLS violations
ALTER TABLE public.tasks ALTER COLUMN user_id SET NOT NULL;
