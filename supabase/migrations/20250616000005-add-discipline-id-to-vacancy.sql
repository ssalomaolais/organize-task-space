<<<<<<< HEAD
-- Add disciplineId column to vacancy table
ALTER TABLE vacancy 
ADD COLUMN IF NOT EXISTS "disciplineId" TEXT;

-- Add foreign key constraint to reference discipline table
ALTER TABLE vacancy 
ADD CONSTRAINT IF NOT EXISTS fk_vacancy_discipline 
FOREIGN KEY ("disciplineId") REFERENCES discipline(value) ON DELETE SET NULL;

-- Add index for better performance
=======
-- Add disciplineId column to vacancy table
ALTER TABLE vacancy 
ADD COLUMN IF NOT EXISTS "disciplineId" TEXT;

-- Add foreign key constraint to reference discipline table
ALTER TABLE vacancy 
ADD CONSTRAINT IF NOT EXISTS fk_vacancy_discipline 
FOREIGN KEY ("disciplineId") REFERENCES discipline(value) ON DELETE SET NULL;

-- Add index for better performance
>>>>>>> e14612f5b969de99aed8a28bb3b611ad29577b10
CREATE INDEX IF NOT EXISTS idx_vacancy_discipline_id ON vacancy("disciplineId"); 