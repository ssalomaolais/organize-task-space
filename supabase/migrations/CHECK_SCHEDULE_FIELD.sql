<<<<<<< HEAD
-- Verificar se o campo schedule existe na tabela tasks
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
    AND column_name = 'schedule';

-- Verificar a estrutura completa da tabela tasks
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;

-- Verificar se há dados salvos no campo schedule
SELECT 
    id, 
    title, 
    schedule 
FROM tasks 
WHERE schedule IS NOT NULL 
    AND schedule != '[]'::jsonb
=======
-- Verificar se o campo schedule existe na tabela tasks
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
    AND column_name = 'schedule';

-- Verificar a estrutura completa da tabela tasks
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;

-- Verificar se há dados salvos no campo schedule
SELECT 
    id, 
    title, 
    schedule 
FROM tasks 
WHERE schedule IS NOT NULL 
    AND schedule != '[]'::jsonb
>>>>>>> e14612f5b969de99aed8a28bb3b611ad29577b10
LIMIT 5; 