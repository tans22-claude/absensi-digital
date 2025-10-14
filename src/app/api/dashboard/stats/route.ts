import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    const startToday = startOfDay(today);
    const endToday = endOfDay(today);
    const startMonth = startOfMonth(today);
    const endMonth = endOfMonth(today);

    // Get total students
    const totalStudents = await prisma.student.count({
      where: {
        isActive: true,
        ...(session.user.schoolId && { schoolId: session.user.schoolId }),
      },
    });

    // Get today's attendance
    const todayAttendance = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startToday,
          lte: endToday,
        },
        ...(session.user.schoolId && {
          student: { schoolId: session.user.schoolId },
        }),
      },
    });

    const presentToday = todayAttendance.filter(
      (a) => a.status === 'PRESENT'
    ).length;
    const absentToday = todayAttendance.filter(
      (a) => a.status !== 'PRESENT'
    ).length;

    const presentPercentage =
      totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

    // Get month's total attendance
    const totalAttendance = await prisma.attendance.count({
      where: {
        date: {
          gte: startMonth,
          lte: endMonth,
        },
        ...(session.user.schoolId && {
          student: { schoolId: session.user.schoolId },
        }),
      },
    });

    return NextResponse.json({
      totalStudents,
      presentToday,
      absentToday,
      presentPercentage,
      totalAttendance,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
