/**
 * API Middleware utilities
 * For protecting API routes and handling errors
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { UserRole } from '@prisma/client';
import { ZodSchema } from 'zod';
import { prisma } from './prisma';

export type ApiHandler = (
  req: NextRequest,
  context: { params?: any }
) => Promise<NextResponse>;

/**
 * Protect API route with authentication
 */
export function withAuth(handler: ApiHandler, allowedRoles?: UserRole[]): ApiHandler {
  return async (req: NextRequest, context: { params?: any }) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Check role permissions
      if (allowedRoles && !allowedRoles.includes(session.user.role)) {
        return NextResponse.json(
          { error: 'Forbidden: Insufficient permissions' },
          { status: 403 }
        );
      }

      // Attach user to request
      (req as any).user = session.user;

      return handler(req, context);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Validate request body with Zod schema
 */
export function withValidation<T>(
  handler: (req: NextRequest, body: T, context: { params?: any }) => Promise<NextResponse>,
  schema: ZodSchema<T>
): ApiHandler {
  return async (req: NextRequest, context: { params?: any }) => {
    try {
      const body = await req.json();
      const validated = schema.parse(body);
      return handler(req, validated, context);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return NextResponse.json(
          {
            error: 'Validation error',
            details: error.errors,
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
  };
}

/**
 * Create audit log entry
 */
export async function createAuditLog(
  userId: string,
  action: string,
  targetType: string,
  targetId: string,
  oldValue?: any,
  newValue?: any,
  req?: NextRequest
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action: action as any,
        targetType,
        targetId,
        oldValue: oldValue || null,
        newValue: newValue || null,
        ipAddress: req?.ip || req?.headers.get('x-forwarded-for') || null,
        userAgent: req?.headers.get('user-agent') || null,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

/**
 * Error handler wrapper
 */
export function withErrorHandler(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest, context: { params?: any }) => {
    try {
      return await handler(req, context);
    } catch (error: any) {
      console.error('API error:', error);

      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Data already exists' },
          { status: 409 }
        );
      }

      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Record not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: error.message || 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Combine multiple middleware
 */
export function compose(...middlewares: ((handler: ApiHandler) => ApiHandler)[]): (handler: ApiHandler) => ApiHandler {
  return (handler: ApiHandler) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}
