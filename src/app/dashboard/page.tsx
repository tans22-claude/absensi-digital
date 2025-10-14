'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ClipboardCheck, UserCheck, UserX } from 'lucide-react';
import { getGreeting } from '@/lib/utils';
import { AttendanceChart } from '@/components/dashboard/attendance-chart';
import { RecentAttendance } from '@/components/dashboard/recent-attendance';
import { useQuery } from '@tanstack/react-query';

export default function DashboardPage() {
  const { data: session } = useSession();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, {session?.user?.name}!
        </h2>
        <p className="text-muted-foreground">
          Berikut adalah ringkasan aktivitas absensi hari ini
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">
              Siswa terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hadir Hari Ini</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.presentToday || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.presentPercentage || 0}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tidak Hadir</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.absentToday || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Sakit, Izin, dan Alfa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Absensi</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAttendance || 0}</div>
            <p className="text-xs text-muted-foreground">
              Bulan ini
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tren Kehadiran</CardTitle>
            <CardDescription>
              Grafik kehadiran 7 hari terakhir
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <AttendanceChart />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Absensi terbaru yang tercatat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentAttendance />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
