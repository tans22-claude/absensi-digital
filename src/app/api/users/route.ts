import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { userSchema } from '@/lib/validations';
import { createAuditLog } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin and superadmin can view users
    if (!['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    const where: any = {};

    if (session.user.schoolId && session.user.role !== 'SUPERADMIN') {
      where.schoolId = session.user.schoolId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        school: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validated = userSchema.parse(body);

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = validated.password
      ? await bcrypt.hash(validated.password, 12)
      : await bcrypt.hash('password123', 12); // Default password

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        passwordHash,
        role: validated.role,
        schoolId: validated.schoolId || session.user.schoolId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    await createAuditLog(
      session.user.id,
      'CREATE',
      'User',
      user.id,
      null,
      user,
      req
    );

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error('User creation error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Data tidak valid', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
