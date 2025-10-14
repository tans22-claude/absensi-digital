/**
 * Utility functions
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'long') {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(d);
  }
  
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Format time to HH:mm
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Get greeting based on time
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Generate random string
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Sleep function for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get attendance status color
 */
export function getAttendanceStatusColor(status: string): string {
  switch (status) {
    case 'PRESENT':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'SICK':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'PERMISSION':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'ABSENT':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
}

/**
 * Get attendance status label
 */
export function getAttendanceStatusLabel(status: string): string {
  switch (status) {
    case 'PRESENT':
      return 'Hadir';
    case 'SICK':
      return 'Sakit';
    case 'PERMISSION':
      return 'Izin';
    case 'ABSENT':
      return 'Alfa';
    default:
      return status;
  }
}

/**
 * Get role label
 */
export function getRoleLabel(role: string): string {
  switch (role) {
    case 'SUPERADMIN':
      return 'Super Admin';
    case 'ADMIN':
      return 'Admin Sekolah';
    case 'TEACHER':
      return 'Guru';
    case 'STUDENT':
      return 'Siswa';
    case 'PARENT':
      return 'Orang Tua';
    default:
      return role;
  }
}

/**
 * Calculate attendance percentage
 */
export function calculateAttendancePercentage(
  present: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
}

/**
 * Get day name in Indonesian
 */
export function getDayName(dayOfWeek: number): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[dayOfWeek] || '';
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
