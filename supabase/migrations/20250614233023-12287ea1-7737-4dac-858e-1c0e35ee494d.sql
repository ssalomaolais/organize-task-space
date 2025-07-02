
-- Create users/profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  stack TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  responsible TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  hours INTEGER DEFAULT 0,
  people INTEGER DEFAULT 1,
  status TEXT NOT NULL CHECK (status IN ('Pendente', 'Em Andamento', 'Completo', 'Cancelado')),
  stack TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('Forum Técnico', 'Meetup Interno', 'Meetup Externo', 'Techup Interno', 'Techup Externo', 'Outros')),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for tasks
CREATE POLICY "Users can view all tasks" ON public.tasks
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create tasks" ON public.tasks
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update tasks" ON public.tasks
  FOR UPDATE USING (true);

CREATE POLICY "Admins can delete tasks" ON public.tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, stack)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    'user',
    'Java'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_stack ON public.tasks(stack);
CREATE INDEX idx_tasks_start_date ON public.tasks(start_date);

CREATE TABLE public.event_type (
  id TEXT PRIMARY,
  title TEXT NOT NULL
)

CREATE TABLE public.stack (
  id TEXT PRIMARY,
  title TEXT NOT NULL
)

CREATE POLICY "Users can view all event_type" ON public.event_type
  FOR SELECT USING (true);

  CREATE POLICY "Users can view all stack" ON public.stack
  FOR SELECT USING (true);


  CREATE POLICY "Admins can update all event_type" ON public.event_type
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.event_type p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

  
  CREATE POLICY "Admins can update all event_type" ON public.event_type
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

  CREATE POLICY "Admins can update all stack" ON public.stack
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert event_type" ON public.event_type
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert stack" ON public.stack
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );