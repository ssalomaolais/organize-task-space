<<<<<<< HEAD
-- Create vacancy table
CREATE TABLE IF NOT EXISTS public.vacancy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  teams TEXT,
  daytoday TEXT,
  "disciplineId" TEXT,
  seniority INTEGER DEFAULT -1,
  regime TEXT DEFAULT 'offsite' CHECK (regime IN ('offsite', 'hybrid', 'físico')),
  quantity INTEGER DEFAULT 1,
  gupylink TEXT,
  local TEXT,
  detail TEXT,
  knowledge TEXT,
  requirement TEXT,
  knowledges JSONB DEFAULT '[]'::jsonb,
  questions TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.vacancy ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vacancy
CREATE POLICY "Users can view all vacancies" ON public.vacancy
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create vacancies" ON public.vacancy
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update vacancies" ON public.vacancy
  FOR UPDATE USING (true);

CREATE POLICY "Admins can delete vacancies" ON public.vacancy
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Add foreign key constraint to reference discipline table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'discipline') THEN
    ALTER TABLE public.vacancy 
    ADD CONSTRAINT IF NOT EXISTS fk_vacancy_discipline 
    FOREIGN KEY ("disciplineId") REFERENCES discipline(value) ON DELETE SET NULL;
  END IF;
END $$;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_vacancy_discipline_id ON public.vacancy("disciplineId");
CREATE INDEX IF NOT EXISTS idx_vacancy_active ON public.vacancy(active);
CREATE INDEX IF NOT EXISTS idx_vacancy_created_at ON public.vacancy(created_at);

-- Add comments
COMMENT ON TABLE public.vacancy IS 'Vacancy table for job opportunities';
=======
-- Create vacancy table
CREATE TABLE IF NOT EXISTS public.vacancy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  teams TEXT,
  daytoday TEXT,
  "disciplineId" TEXT,
  seniority INTEGER DEFAULT -1,
  regime TEXT DEFAULT 'offsite' CHECK (regime IN ('offsite', 'hybrid', 'físico')),
  quantity INTEGER DEFAULT 1,
  gupylink TEXT,
  local TEXT,
  detail TEXT,
  knowledge TEXT,
  requirement TEXT,
  knowledges JSONB DEFAULT '[]'::jsonb,
  questions TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.vacancy ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vacancy
CREATE POLICY "Users can view all vacancies" ON public.vacancy
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create vacancies" ON public.vacancy
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update vacancies" ON public.vacancy
  FOR UPDATE USING (true);

CREATE POLICY "Admins can delete vacancies" ON public.vacancy
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Add foreign key constraint to reference discipline table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'discipline') THEN
    ALTER TABLE public.vacancy 
    ADD CONSTRAINT IF NOT EXISTS fk_vacancy_discipline 
    FOREIGN KEY ("disciplineId") REFERENCES discipline(value) ON DELETE SET NULL;
  END IF;
END $$;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_vacancy_discipline_id ON public.vacancy("disciplineId");
CREATE INDEX IF NOT EXISTS idx_vacancy_active ON public.vacancy(active);
CREATE INDEX IF NOT EXISTS idx_vacancy_created_at ON public.vacancy(created_at);

-- Add comments
COMMENT ON TABLE public.vacancy IS 'Vacancy table for job opportunities';
>>>>>>> e14612f5b969de99aed8a28bb3b611ad29577b10
COMMENT ON COLUMN public.vacancy.knowledges IS 'Array of knowledge objects with structure: {knowledge: string, required: boolean}'; 