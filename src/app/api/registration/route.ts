import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Validation schema
const registrationSchema = z.object({
  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  nisn: z.string().length(10, 'NISN harus 10 digit'),
  gender: z.enum(['MALE', 'FEMALE'], { required_error: 'Jenis kelamin harus dipilih' }),
  birthPlace: z.string().min(2, 'Tempat lahir minimal 2 karakter'),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Format tanggal tidak valid'),
  address: z.string().min(10, 'Alamat minimal 10 karakter'),
  parentName: z.string().min(3, 'Nama orang tua minimal 3 karakter'),
  parentPhone: z.string().min(10, 'Nomor HP minimal 10 digit').max(15, 'Nomor HP maksimal 15 digit'),
  targetGrade: z.string().min(1, 'Kelas yang dituju harus dipilih'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  schoolId: z.string().optional(),
});

// GET - Get all registrations (for admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const schoolId = searchParams.get('schoolId');

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (schoolId) {
      where.schoolId = schoolId;
    }

    const registrations = await prisma.studentRegistration.findMany({
      where,
      include: {
        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        registeredAt: 'desc',
      },
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pendaftaran' },
      { status: 500 }
    );
  }
}

// POST - Create new registration
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validatedData = registrationSchema.parse(body);

    // Check if NISN already exists
    const existingNISN = await prisma.studentRegistration.findUnique({
      where: { nisn: validatedData.nisn },
    });

    if (existingNISN) {
      return NextResponse.json(
        { error: 'NISN sudah terdaftar. Silakan gunakan NISN yang berbeda.' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await prisma.studentRegistration.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar. Silakan gunakan email yang berbeda.' },
        { status: 400 }
      );
    }

    // Also check in User table
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar di sistem. Silakan gunakan email yang berbeda.' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 10);

    // Create registration
    const registration = await prisma.studentRegistration.create({
      data: {
        fullName: validatedData.fullName,
        nisn: validatedData.nisn,
        gender: validatedData.gender,
        birthPlace: validatedData.birthPlace,
        birthDate: new Date(validatedData.birthDate),
        address: validatedData.address,
        parentName: validatedData.parentName,
        parentPhone: validatedData.parentPhone,
        targetGrade: validatedData.targetGrade,
        email: validatedData.email,
        passwordHash,
        schoolId: validatedData.schoolId || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Pendaftaran siswa baru berhasil! Silakan tunggu konfirmasi dari admin sekolah.',
        data: {
          id: registration.id,
          fullName: registration.fullName,
          email: registration.email,
          registeredAt: registration.registeredAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating registration:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Gagal memproses pendaftaran. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
