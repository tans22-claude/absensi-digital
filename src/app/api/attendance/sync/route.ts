import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/api-middleware';
import { attendanceSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = attendanceSchema.parse(body);

    const date = new Date(validated.date);
    date.setHours(0, 0, 0, 0);

    // Check if already exists
    const existing = await prisma.attendance.findFirst({
      where: {
        studentId: validated.studentId,
        date: date,
      },
    });

    let attendance;

    if (existing) {
      // Update existing
      attendance = await prisma.attendance.update({
        where: { id: existing.id },
        data: {
          status: validated.status,
          note: validated.note,
          recordedBy: session.user.id,
          method: validated.method || 'MANUAL',
          synced: true,
        },
      });

      await createAuditLog(
        session.user.id,
        'UPDATE',
        'Attendance',
        attendance.id,
        existing,
        attendance,
        req
      );
    } else {
      // Create new
      attendance = await prisma.attendance.create({
        data: {
          studentId: validated.studentId,
          classId: validated.classId,
          scheduleId: validated.scheduleId,
          date: date,
          status: validated.status,
          note: validated.note,
          recordedBy: session.user.id,
          method: validated.method || 'MANUAL',
          synced: true,
        },
      });

      await createAuditLog(
        session.user.id,
        'CREATE',
        'Attendance',
        attendance.id,
        null,
        attendance,
        req
      );
    }

    return NextResponse.json({
      message: 'Attendance synced successfully',
      attendance,
    });
  } catch (error: any) {
    console.error('Sync attendance error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to sync attendance' },
      { status: 500 }
    );
  }
}
