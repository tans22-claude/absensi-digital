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

    const recentAttendance = await prisma.attendance.findMany({
      where: {
        ...(session.user.schoolId && {
          student: { schoolId: session.user.schoolId },
        }),
      },
      include: {
        student: {
          select: {
            name: true,
          },
        },
        class: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        recordedAt: 'desc',
      },
      take: 5,
    });

    return NextResponse.json(recentAttendance);
  } catch (error) {
    console.error('Recent attendance error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent attendance' },
      { status: 500 }
    );
  }
}
