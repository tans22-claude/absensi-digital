'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QRAttendance } from '@/components/attendance/qr-attendance';
import { ManualAttendance } from '@/components/attendance/manual-attendance';
import { AttendanceHistory } from '@/components/attendance/attendance-history';
import { QrCode, Edit, History } from 'lucide-react';

export default function AttendancePage() {
  const { data: session } = useSession();
  const isTeacher = session?.user?.role === 'TEACHER' || session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPERADMIN';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Absensi</h2>
        <p className="text-muted-foreground">
          Kelola kehadiran siswa dengan QR Code atau input manual
        </p>
      </div>

      <Tabs defaultValue="qr" className="space-y-4">
        <TabsList>
          <TabsTrigger value="qr">
            <QrCode className="mr-2 h-4 w-4" />
            QR Code
          </TabsTrigger>
          {isTeacher && (
            <TabsTrigger value="manual">
              <Edit className="mr-2 h-4 w-4" />
              Manual
            </TabsTrigger>
          )}
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            Riwayat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="qr" className="space-y-4">
          <QRAttendance />
        </TabsContent>

        {isTeacher && (
          <TabsContent value="manual" className="space-y-4">
            <ManualAttendance />
          </TabsContent>
        )}

        <TabsContent value="history" className="space-y-4">
          <AttendanceHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
