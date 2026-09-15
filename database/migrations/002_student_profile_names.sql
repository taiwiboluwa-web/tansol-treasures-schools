ALTER TABLE students ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
UPDATE students s SET full_name = u.full_name FROM users u WHERE s.user_id = u.id AND (s.full_name IS NULL OR s.full_name = '');
ALTER TABLE students ALTER COLUMN full_name SET NOT NULL;
