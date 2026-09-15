import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/server';
import { getPublishedStudentResults, getStudentIdentity } from '@/lib/db/results';
import { resultLookupSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    const parsed = resultLookupSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid result request.' }, { status: 400 });
    const student = await getStudentIdentity(session.userId);
    if (!student) return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });
    const results = await getPublishedStudentResults(student.student_id, parsed.data.session, parsed.data.term);
    return NextResponse.json({ student, results });
  } catch {
    return NextResponse.json({ error: 'Unable to retrieve results.' }, { status: 500 });
  }
}
