'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardCheck,
  BarChart3,
  Settings,
  School,
  BookOpen,
  UserCog,
  FileText,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['SUPERADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
  },
  {
    name: 'Kelas',
    href: '/dashboard/classes',
    icon: School,
    roles: ['SUPERADMIN', 'ADMIN', 'TEACHER'],
  },
  {
    name: 'Siswa',
    href: '/dashboard/students',
    icon: Users,
    roles: ['SUPERADMIN', 'ADMIN', 'TEACHER'],
  },
  {
    name: 'Jadwal',
    href: '/dashboard/schedules',
    icon: Calendar,
    roles: ['SUPERADMIN', 'ADMIN', 'TEACHER'],
  },
  {
    name: 'Absensi',
    href: '/dashboard/attendance',
    icon: ClipboardCheck,
    roles: ['SUPERADMIN', 'ADMIN', 'TEACHER', 'STUDENT'],
  },
  {
    name: 'Laporan',
    href: '/dashboard/reports',
    icon: BarChart3,
    roles: ['SUPERADMIN', 'ADMIN', 'TEACHER'],
  },
  {
    name: 'Audit Log',
    href: '/dashboard/audit',
    icon: FileText,
    roles: ['SUPERADMIN', 'ADMIN'],
  },
  {
    name: 'Pengguna',
    href: '/dashboard/users',
    icon: UserCog,
    roles: ['SUPERADMIN', 'ADMIN'],
  },
  {
    name: 'Pengaturan',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['SUPERADMIN', 'ADMIN', 'TEACHER', 'STUDENT'],
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(session?.user?.role || '')
  );

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
              Attendance
            </span>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 flex-shrink-0 h-5 w-5',
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
