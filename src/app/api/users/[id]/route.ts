import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/api-middleware';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { id } = params;

    const existing = await prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
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
      'UPDATE',
      'User',
      id,
      existing,
      updated,
      req
    );

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('User update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;

    // Prevent self-deletion
    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id },
    });

    await createAuditLog(
      session.user.id,
      'DELETE',
      'User',
      id,
      existing,
      null,
      req
    );

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('User deletion error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
