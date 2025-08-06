-- Add disciplineId column to vacancy table
ALTER TABLE vacancy 
ADD COLUMN IF NOT EXISTS "disciplineId" TEXT;

-- Add foreign key constraint to reference discipline table
ALTER TABLE vacancy 
ADD CONSTRAINT IF NOT EXISTS fk_vacancy_discipline 
FOREIGN KEY ("disciplineId") REFERENCES discipline(value) ON DELETE SET NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_vacancy_discipline_id ON vacancy("disciplineId"); 