'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Calendar, Clock } from 'lucide-react';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function SchedulesPage() {
  const { data: schedules, isLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const res = await fetch('/api/schedules');
      if (!res.ok) throw new Error('Failed to fetch schedules');
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Jadwal</h2>
        <p className="text-muted-foreground">
          Jadwal pelajaran dan kelas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jadwal Pelajaran</CardTitle>
          <CardDescription>
            Jadwal kelas dan mata pelajaran
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}

          {schedules && schedules.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hari</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Mata Pelajaran</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Ruangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule: any) => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {DAYS[schedule.dayOfWeek]}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{schedule.class?.name}</TableCell>
                    <TableCell>{schedule.subject}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                    </TableCell>
                    <TableCell>{schedule.room || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {schedules && schedules.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada jadwal terdaftar
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
