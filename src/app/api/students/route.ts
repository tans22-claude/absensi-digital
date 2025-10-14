import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');

    const where: any = { isActive: true };

    // Filter by school
    if (session.user.schoolId) {
      where.schoolId = session.user.schoolId;
    }

    // Filter by class
    if (classId) {
      where.classId = classId;
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        class: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Students fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}
