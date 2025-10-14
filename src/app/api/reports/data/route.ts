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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const where: any = {
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    };

    if (classId) {
      where.classId = classId;
    }

    if (session.user.schoolId) {
      where.student = { schoolId: session.user.schoolId };
    }

    const records = await prisma.attendance.findMany({
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
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Calculate summary
    const summary = {
      totalRecords: records.length,
      present: records.filter((r) => r.status === 'PRESENT').length,
      sick: records.filter((r) => r.status === 'SICK').length,
      permission: records.filter((r) => r.status === 'PERMISSION').length,
      absent: records.filter((r) => r.status === 'ABSENT').length,
    };

    return NextResponse.json({
      records,
      summary,
    });
  } catch (error) {
    console.error('Report data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report data' },
      { status: 500 }
    );
  }
}
