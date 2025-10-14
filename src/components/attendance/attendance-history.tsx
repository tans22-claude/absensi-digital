'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatDate, getAttendanceStatusColor, getAttendanceStatusLabel } from '@/lib/utils';
import { Search, Loader2 } from 'lucide-react';

export function AttendanceHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const { data: history, isLoading } = useQuery({
    queryKey: ['attendance-history', searchTerm, dateFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (dateFilter) params.append('date', dateFilter);

      const res = await fetch(`/api/attendance/history?${params}`);
      if (!res.ok) throw new Error('Failed to fetch history');
      return res.json();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Absensi</CardTitle>
        <CardDescription>
          Lihat riwayat absensi yang telah tercatat
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama siswa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-[200px]"
          />
        </div>

        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {history && history.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Siswa</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Metode</TableHead>
                <TableHead>Dicatat Oleh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((record: any) => (
                <TableRow key={record.id}>
                  <TableCell>{formatDate(record.date)}</TableCell>
                  <TableCell className="font-medium">{record.student.name}</TableCell>
                  <TableCell>{record.class.name}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getAttendanceStatusColor(
                        record.status
                      )}`}
                    >
                      {getAttendanceStatusLabel(record.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {record.method === 'QR_SCAN' ? 'QR Scan' : 'Manual'}
                  </TableCell>
                  <TableCell>{record.recorder.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {history && history.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Tidak ada data absensi
          </div>
        )}
      </CardContent>
    </Card>
  );
}
