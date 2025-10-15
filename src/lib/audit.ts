import { prisma } from '@/lib/prisma';
import { AuditAction, Prisma } from '@prisma/client';

// Helper function to create audit log
export async function createAuditLog(
  userId: string,
  action: AuditAction,
  targetType: string,
  targetId: string,
  oldValue?: any,
  newValue?: any,
  ipAddress?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        targetType,
        targetId,
        oldValue: oldValue ? oldValue as Prisma.InputJsonValue : Prisma.JsonNull,
        newValue: newValue ? newValue as Prisma.InputJsonValue : Prisma.JsonNull,
        ipAddress,
      },
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
}
