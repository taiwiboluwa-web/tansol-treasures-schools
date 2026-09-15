import { queryNeon } from './client';

export type StudentResult = { subject:string; ca_score:number; exam_score:number; total_score:number; grade:string; remark:string|null };

export async function getStudentIdentity(userId:string) {
  const rows=await queryNeon<{student_id:string; class_name:string; guardian_name:string|null}>('SELECT student_id, class_name, guardian_name FROM students WHERE user_id = $1 LIMIT 1',[userId]);
  return rows[0] ?? null;
}

export async function getPublishedStudentResults(studentId:string, session:string, term:string) {
  return queryNeon<StudentResult>(`SELECT subject, ca_score, exam_score, total_score, grade, remark FROM results WHERE student_id = $1 AND session = $2 AND term = $3 AND is_published = TRUE ORDER BY subject`,[studentId,session,term]);
}
