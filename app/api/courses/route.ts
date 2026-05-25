import { prisma } from '@/lib/db';
import { requireAuth, jsonOk } from '@/lib/api-utils';
import { mapCourse } from '@/lib/mappers';

export async function GET() {
  const userId = await import('@/lib/auth').then((m) => m.getSessionUserId());
  const courses = await prisma.course.findMany({ orderBy: { createdAt: 'asc' } });
  let enrollments: { courseId: string; progress: number }[] = [];
  if (userId) {
    enrollments = await prisma.enrollment.findMany({
      where: { userId },
      select: { courseId: true, progress: true },
    });
  }
  const enrollmentMap = new Map(enrollments.map((e) => [e.courseId, e]));
  return jsonOk(
    courses.map((c) => mapCourse(c, enrollmentMap.get(c.id) ?? null))
  );
}
