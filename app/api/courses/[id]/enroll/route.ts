import { prisma } from '@/lib/db';
import { requireAuth, jsonOk, jsonError } from '@/lib/api-utils';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await requireAuth();
  if (error) return error;
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return jsonError('Course not found', 404);

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: userId!, courseId: id } },
  });
  if (existing) return jsonOk({ enrolled: true, courseId: id, alreadyEnrolled: true });

  await prisma.enrollment.create({
    data: { userId: userId!, courseId: id, progress: 0 },
  });
  return jsonOk({ enrolled: true, courseId: id, alreadyEnrolled: false });
}
