-- Create discipline table
CREATE TABLE IF NOT EXISTS discipline (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    value TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some default disciplines
INSERT INTO discipline (value, label, color) VALUES
    ('java', 'Java', 'bg-blue-500'),
    ('bd', 'Banco de Dados', 'bg-green-500'),
    ('poo', 'POO', 'bg-yellow-500'),
    ('php', 'PHP', 'bg-purple-500'),
    ('.net', '.Net', 'bg-red-500'),
    ('logica', 'Lógica', 'bg-indigo-500'),
    ('arquitetura', 'Arquitetura', 'bg-pink-500'),
    ('devops', 'Devops', 'bg-orange-500'),
    ('cloud', 'Cloud', 'bg-gray-500'),
    ('negócio', 'Negócios', 'bg-teal-500'),
    ('angular', 'Angular', 'bg-emerald-500'),
    ('vue', 'Vue', 'bg-cyan-500'),
    ('React', 'React', 'bg-rose-500'),
    ('nodejs', 'Node.js', 'bg-violet-500'),
    ('outros', 'Outros', 'bg-slate-500')
ON CONFLICT (value) DO NOTHING;

-- Create RLS policies
ALTER TABLE discipline ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read disciplines
CREATE POLICY "Allow authenticated users to read disciplines" ON discipline
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow only admins to insert, update, and delete disciplines
CREATE POLICY "Allow admins to insert disciplines" ON discipline
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Allow admins to update disciplines" ON discipline
    FOR UPDATE USING (auth.role() = 'authenticated' AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Allow admins to delete disciplines" ON discipline
    FOR DELETE USING (auth.role() = 'authenticated' AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));
