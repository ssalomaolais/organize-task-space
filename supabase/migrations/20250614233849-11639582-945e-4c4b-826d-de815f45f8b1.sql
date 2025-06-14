
-- Add active column to profiles table to enable/disable users
ALTER TABLE public.profiles 
ADD COLUMN active BOOLEAN DEFAULT true;

-- Update RLS policies to allow admins to manage users
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

-- Create index for better performance on active column
CREATE INDEX idx_profiles_active ON public.profiles(active);
