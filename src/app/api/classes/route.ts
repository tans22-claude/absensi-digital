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

    const where: any = { isActive: true };

    // Filter by school
    if (session.user.schoolId) {
      where.schoolId = session.user.schoolId;
    }

    // Filter by teacher
    if (session.user.role === 'TEACHER') {
      where.teacherId = session.user.id;
    }

    const classes = await prisma.class.findMany({
      where,
      include: {
        teacher: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Classes fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}
