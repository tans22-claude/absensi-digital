/**
 * NextAuth Configuration
 * Handles authentication with email/password, Google OAuth, and 2FA
 */

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { UserRole } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        totpCode: { label: '2FA Code', type: 'text', optional: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password harus diisi');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { school: true },
        });

        if (!user || !user.passwordHash) {
          throw new Error('Email atau password salah');
        }

        if (!user.isActive) {
          throw new Error('Akun Anda telah dinonaktifkan');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error('Email atau password salah');
        }

        // Check 2FA if enabled
        if (user.totpEnabled && user.totpSecret) {
          if (!credentials.totpCode) {
            throw new Error('Kode 2FA diperlukan');
          }

          const { verifyTOTP } = await import('./totp');
          const isValid = verifyTOTP(user.totpSecret, credentials.totpCode);

          if (!isValid) {
            throw new Error('Kode 2FA tidak valid');
          }
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          schoolId: user.schoolId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.schoolId = user.schoolId;
      }

      // Handle session update
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.schoolId = token.schoolId as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

// Type augmentation for NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      schoolId: string | null;
      image?: string | null;
    };
  }

  interface User {
    role: UserRole;
    schoolId: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    schoolId: string | null;
  }
}
