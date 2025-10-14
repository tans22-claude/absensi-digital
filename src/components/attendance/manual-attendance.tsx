'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save } from 'lucide-react';
import { getAttendanceStatusColor, getAttendanceStatusLabel } from '@/lib/utils';

export function ManualAttendance() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});

  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await fetch('/api/classes');
      if (!res.ok) throw new Error('Failed to fetch classes');
      return res.json();
    },
  });

  const { data: students, isLoading } = useQuery({
    queryKey: ['students', selectedClass],
    queryFn: async () => {
      const res = await fetch(`/api/students?classId=${selectedClass}`);
      if (!res.ok) throw new Error('Failed to fetch students');
      return res.json();
    },
    enabled: !!selectedClass,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const attendances = Object.entries(attendanceData).map(([studentId, status]) => ({
        studentId,
        status,
      }));

      const res = await fetch('/api/attendance/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass,
          date: new Date().toISOString(),
          attendances,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save attendance');
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Berhasil',
        description: 'Data absensi telah disimpan',
      });
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      setAttendanceData({});
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSave = () => {
    if (Object.keys(attendanceData).length === 0) {
      toast({
        title: 'Peringatan',
        description: 'Belum ada data absensi yang diisi',
        variant: 'destructive',
      });
      return;
    }

    saveMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Absensi Manual</CardTitle>
        <CardDescription>
          Pilih kelas dan tandai kehadiran siswa secara manual
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Pilih Kelas</label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kelas" />
            </SelectTrigger>
            <SelectContent>
              {classes?.map((cls: any) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name} - {cls.grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {students && students.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIS</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>Status Kehadiran</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student: any) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.nis}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Select
                        value={attendanceData[student.id] || ''}
                        onValueChange={(value) => handleStatusChange(student.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRESENT">Hadir</SelectItem>
                          <SelectItem value="SICK">Sakit</SelectItem>
                          <SelectItem value="PERMISSION">Izin</SelectItem>
                          <SelectItem value="ABSENT">Alfa</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Absensi
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {students && students.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Tidak ada siswa di kelas ini
          </div>
        )}
      </CardContent>
    </Card>
  );
}
