import { queryNeon } from './client';

export type StudentResult = {
  id?: string;
  subject: string;
  ca_score: number;
  exam_score: number;
  total_score: number;
  grade: string;
  remark: string | null;
  session?: string;
  term?: string;
};

export async function getStudentIdentity(userId: string) {
  const rows = await queryNeon<{ id: string; student_id: string; full_name: string; class_name: string; guardian_name: string | null }>(
    'SELECT id, student_id, full_name, class_name, guardian_name FROM students WHERE user_id = $1 LIMIT 1',
    [userId]
  );
  return rows[0] ?? null;
}

export async function getPublishedStudentResults(studentId: string, session: string, term: string) {
  return queryNeon<StudentResult>(
    `SELECT id, subject, ca_score, exam_score, total_score, grade, remark
     FROM results
     WHERE student_id = $1 AND session = $2 AND term = $3 AND is_published = TRUE
     ORDER BY subject`,
    [studentId, session, term]
  );
}

export async function getStudentResultHistory(studentId: string) {
  return queryNeon<StudentResult>(
    `SELECT id, subject, ca_score, exam_score, total_score, grade, remark, session, term
     FROM results
     WHERE student_id = $1 AND is_published = TRUE
     ORDER BY session DESC, term DESC, subject`,
    [studentId]
  );
}

export async function getCurrentAcademicPeriod(studentId: string) {
  const currentSession = await queryNeon<{ name: string }>(
    `SELECT name FROM academic_sessions WHERE is_current = TRUE ORDER BY created_at DESC LIMIT 1`
  );
  const session = currentSession[0]?.name ?? '2025/2026';
  const publishedTerms = await queryNeon<{ term: string }>(
    `SELECT DISTINCT term FROM results WHERE student_id=$1 AND session=$2 AND is_published=TRUE ORDER BY term DESC LIMIT 1`,
    [studentId, session]
  );
  const term = publishedTerms[0]?.term ?? 'First Term';
  return { session, term };
}
