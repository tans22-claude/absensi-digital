'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Users } from 'lucide-react';

export default function ClassesPage() {
  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await fetch('/api/classes');
      if (!res.ok) throw new Error('Failed to fetch classes');
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Kelas</h2>
        <p className="text-muted-foreground">
          Daftar kelas yang terdaftar
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kelas</CardTitle>
          <CardDescription>
            Semua kelas yang tersedia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}

          {classes && classes.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Kelas</TableHead>
                  <TableHead>Tingkat</TableHead>
                  <TableHead>Wali Kelas</TableHead>
                  <TableHead>Jumlah Siswa</TableHead>
                  <TableHead>Tahun Ajaran</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((cls: any) => (
                  <TableRow key={cls.id}>
                    <TableCell className="font-medium">{cls.name}</TableCell>
                    <TableCell>{cls.grade}</TableCell>
                    <TableCell>{cls.teacher?.name || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {cls._count?.students || 0}
                      </div>
                    </TableCell>
                    <TableCell>{cls.academicYear}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {classes && classes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada kelas terdaftar
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
