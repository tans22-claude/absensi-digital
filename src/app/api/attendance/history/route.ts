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
    const search = searchParams.get('search');
    const date = searchParams.get('date');

    const where: any = {};

    // Filter by school
    if (session.user.schoolId) {
      where.student = { schoolId: session.user.schoolId };
    }

    // Filter by student role
    if (session.user.role === 'STUDENT') {
      const student = await prisma.student.findFirst({
        where: { userId: session.user.id },
      });

      if (student) {
        where.studentId = student.id;
      }
    }

    // Search filter
    if (search) {
      where.student = {
        ...where.student,
        name: { contains: search, mode: 'insensitive' },
      };
    }

    // Date filter
    if (date) {
      const filterDate = new Date(date);
      filterDate.setHours(0, 0, 0, 0);
      where.date = filterDate;
    }

    const history = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          select: {
            name: true,
            nis: true,
          },
        },
        class: {
          select: {
            name: true,
          },
        },
        recorder: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        recordedAt: 'desc',
      },
      take: 50,
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error('Attendance history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance history' },
      { status: 500 }
    );
  }
}
