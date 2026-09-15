-- Teacher-created pupil profiles need to store the pupil's name before login credentials are linked.
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
