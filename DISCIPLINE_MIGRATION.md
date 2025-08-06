# Migração de Disciplinas

## Executar a migração

Para criar a tabela de disciplinas no banco de dados, execute a seguinte migração SQL:

```sql
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
    ('matematica', 'Matemática', 'bg-blue-500'),
    ('portugues', 'Português', 'bg-green-500'),
    ('historia', 'História', 'bg-yellow-500'),
    ('geografia', 'Geografia', 'bg-purple-500'),
    ('ciencias', 'Ciências', 'bg-red-500'),
    ('ingles', 'Inglês', 'bg-indigo-500'),
    ('artes', 'Artes', 'bg-pink-500'),
    ('educacao_fisica', 'Educação Física', 'bg-orange-500'),
    ('filosofia', 'Filosofia', 'bg-gray-500'),
    ('sociologia', 'Sociologia', 'bg-teal-500'),
    ('biologia', 'Biologia', 'bg-emerald-500'),
    ('fisica', 'Física', 'bg-cyan-500'),
    ('quimica', 'Química', 'bg-rose-500'),
    ('literatura', 'Literatura', 'bg-violet-500'),
    ('redacao', 'Redação', 'bg-amber-500'),
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
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    ));

CREATE POLICY "Allow admins to update disciplines" ON discipline
    FOR UPDATE USING (auth.role() = 'authenticated' AND EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    ));

CREATE POLICY "Allow admins to delete disciplines" ON discipline
    FOR DELETE USING (auth.role() = 'authenticated' AND EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    ));
```

## Como executar

1. Acesse o painel do Supabase
2. Vá para a seção SQL Editor
3. Cole o código SQL acima
4. Execute a query

## Funcionalidades implementadas

1. **Hook useDiscipline**: Gerencia as operações CRUD para disciplinas
2. **Componente DisciplineForm**: Formulário para criar/editar disciplinas
3. **Componente DisciplinesPage**: Página de listagem de disciplinas
4. **Componente DisciplinesPageModal**: Modal para gerenciar disciplinas
5. **Atualização do ResponsibleList**: Adicionada coluna disciplina
6. **Atualização do Header**: Adicionado link para disciplinas no menu
7. **Atualização do TaskForm**: Integração com disciplinas

## Estrutura da tabela

- `id`: UUID único
- `value`: Identificador único da disciplina
- `label`: Nome exibido da disciplina
- `color`: Cor da disciplina (classe CSS do Tailwind)
- `created_at`: Data de criação
- `updated_at`: Data de atualização 