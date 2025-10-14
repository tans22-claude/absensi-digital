import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/api-middleware';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { classId, qrData } = await req.json();

    // Parse and validate QR data
    const parsed = JSON.parse(qrData);

    if (parsed.type !== 'attendance') {
      return NextResponse.json(
        { error: 'QR Code tidak valid' },
        { status: 400 }
      );
    }

    if (Date.now() > parsed.expires) {
      return NextResponse.json(
        { error: 'QR Code sudah kadaluarsa' },
        { status: 400 }
      );
    }

    // Find student profile for this user
    const student = await prisma.student.findFirst({
      where: {
        userId: session.user.id,
        classId: classId,
        isActive: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Profil siswa tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if already marked attendance today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        studentId: student.id,
        date: today,
      },
    });

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Anda sudah absen hari ini' },
        { status: 400 }
      );
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        studentId: student.id,
        classId: classId,
        date: today,
        status: 'PRESENT',
        recordedBy: session.user.id,
        method: 'QR_SCAN',
      },
      include: {
        student: true,
        class: true,
      },
    });

    // Create audit log
    await createAuditLog(
      session.user.id,
      'CREATE',
      'Attendance',
      attendance.id,
      null,
      attendance,
      req
    );

    return NextResponse.json({
      message: 'Absensi berhasil dicatat',
      attendance,
    });
  } catch (error: any) {
    console.error('QR scan attendance error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal mencatat absensi' },
      { status: 500 }
    );
  }
}
