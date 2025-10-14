import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { subDays, format } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chartData = [];
    
    // Get last 7 days data
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');

      const attendance = await prisma.attendance.findMany({
        where: {
          date: new Date(dateStr),
          ...(session.user.schoolId && {
            student: { schoolId: session.user.schoolId },
          }),
        },
      });

      const present = attendance.filter((a) => a.status === 'PRESENT').length;
      const absent = attendance.filter((a) => a.status !== 'PRESENT').length;

      chartData.push({
        date: format(date, 'dd MMM'),
        present,
        absent,
      });
    }

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Chart data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}
