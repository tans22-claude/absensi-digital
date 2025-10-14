import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validated.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        passwordHash,
        role: validated.role,
        schoolId: validated.schoolId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(
      { message: 'Registrasi berhasil', user },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Data tidak valid', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    );
  }
}
