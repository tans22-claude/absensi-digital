import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/api-middleware';
import { bulkAttendanceSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is teacher or admin
    if (!['TEACHER', 'ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validated = bulkAttendanceSchema.parse(body);

    const date = new Date(validated.date);
    date.setHours(0, 0, 0, 0);

    // Create attendance records
    const results = await Promise.all(
      validated.attendances.map(async (item) => {
        // Check if already exists
        const existing = await prisma.attendance.findFirst({
          where: {
            studentId: item.studentId,
            date: date,
          },
        });

        if (existing) {
          // Update existing
          const updated = await prisma.attendance.update({
            where: { id: existing.id },
            data: {
              status: item.status,
              note: item.note,
              recordedBy: session.user.id,
              method: 'MANUAL',
            },
          });

          await createAuditLog(
            session.user.id,
            'UPDATE',
            'Attendance',
            updated.id,
            existing,
            updated,
            req
          );

          return updated;
        } else {
          // Create new
          const created = await prisma.attendance.create({
            data: {
              studentId: item.studentId,
              classId: validated.classId,
              scheduleId: validated.scheduleId,
              date: date,
              status: item.status,
              note: item.note,
              recordedBy: session.user.id,
              method: 'MANUAL',
            },
          });

          await createAuditLog(
            session.user.id,
            'CREATE',
            'Attendance',
            created.id,
            null,
            created,
            req
          );

          return created;
        }
      })
    );

    return NextResponse.json({
      message: 'Absensi berhasil disimpan',
      count: results.length,
    });
  } catch (error: any) {
    console.error('Bulk attendance error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Data tidak valid', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Gagal menyimpan absensi' },
      { status: 500 }
    );
  }
}
