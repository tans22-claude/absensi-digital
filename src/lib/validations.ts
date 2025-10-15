/**
 * Zod validation schemas
 */

import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  totpCode: z.string().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung huruf besar')
    .regex(/[a-z]/, 'Password harus mengandung huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung angka'),
  confirmPassword: z.string(),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']),
  schoolId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung huruf besar')
    .regex(/[a-z]/, 'Password harus mengandung huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung angka'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

// School schema
export const schoolSchema = z.object({
  name: z.string().min(3, 'Nama sekolah minimal 3 karakter'),
  address: z.string().optional(),
  timezone: z.string().default('Asia/Jakarta'),
  phone: z.string().optional(),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
});

// Class schema
export const classSchema = z.object({
  name: z.string().min(1, 'Nama kelas harus diisi'),
  grade: z.string().min(1, 'Tingkat kelas harus diisi'),
  teacherId: z.string().optional(),
  academicYear: z.string().min(1, 'Tahun ajaran harus diisi'),
});

// Student schema
export const studentSchema = z.object({
  nis: z.string().min(1, 'NIS harus diisi'),
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  classId: z.string().min(1, 'Kelas harus dipilih'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['L', 'P']).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  parentId: z.string().optional(),
});

// Schedule schema
export const scheduleSchema = z.object({
  classId: z.string().min(1, 'Kelas harus dipilih'),
  subject: z.string().min(1, 'Mata pelajaran harus diisi'),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format waktu tidak valid (HH:mm)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format waktu tidak valid (HH:mm)'),
  teacherId: z.string().optional(),
  room: z.string().optional(),
});

// Attendance schema
export const attendanceSchema = z.object({
  studentId: z.string().min(1, 'Siswa harus dipilih'),
  classId: z.string().min(1, 'Kelas harus dipilih'),
  scheduleId: z.string().optional(),
  date: z.string().or(z.date()),
  status: z.enum(['PRESENT', 'SICK', 'PERMISSION', 'ABSENT']),
  note: z.string().optional(),
  method: z.enum(['QR_SCAN', 'MANUAL']).optional(),
});

// Bulk attendance schema
export const bulkAttendanceSchema = z.object({
  classId: z.string().min(1, 'Kelas harus dipilih'),
  scheduleId: z.string().optional(),
  date: z.string().or(z.date()),
  attendances: z.array(z.object({
    studentId: z.string(),
    status: z.enum(['PRESENT', 'SICK', 'PERMISSION', 'ABSENT']),
    note: z.string().optional(),
  })),
});

// User schema
export const userSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  role: z.enum(['SUPERADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT']),
  schoolId: z.string().optional(),
  password: z.string().min(8, 'Password minimal 8 karakter').optional(),
});

// Report filter schema
export const reportFilterSchema = z.object({
  classId: z.string().optional(),
  studentId: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  status: z.enum(['PRESENT', 'SICK', 'PERMISSION', 'ABSENT', 'ALL']).optional(),
});

// CSV import schema
export const csvImportSchema = z.object({
  file: typeof File !== 'undefined' 
    ? z.instanceof(File).refine(
        (file) => file.type === 'text/csv' || file.name.endsWith('.csv'),
        'File harus berformat CSV'
      )
    : z.any(),
  classId: z.string().min(1, 'Kelas harus dipilih'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type SchoolInput = z.infer<typeof schoolSchema>;
export type ClassInput = z.infer<typeof classSchema>;
export type StudentInput = z.infer<typeof studentSchema>;
export type ScheduleInput = z.infer<typeof scheduleSchema>;
export type AttendanceInput = z.infer<typeof attendanceSchema>;
export type BulkAttendanceInput = z.infer<typeof bulkAttendanceSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type ReportFilterInput = z.infer<typeof reportFilterSchema>;
