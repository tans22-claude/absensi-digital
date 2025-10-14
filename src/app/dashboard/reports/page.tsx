'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Download, FileText, Loader2 } from 'lucide-react';
import { formatDate, getAttendanceStatusColor, getAttendanceStatusLabel } from '@/lib/utils';

export default function ReportsPage() {
  const { toast } = useToast();
  const [classId, setClassId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await fetch('/api/classes');
      if (!res.ok) throw new Error('Failed to fetch classes');
      return res.json();
    },
  });

  const { data: reportData, isLoading, refetch } = useQuery({
    queryKey: ['report', classId, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (classId && classId !== 'all') params.append('classId', classId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`/api/reports/data?${params}`);
      if (!res.ok) throw new Error('Failed to fetch report');
      return res.json();
    },
    enabled: false,
  });

  const handleGenerate = () => {
    if (!startDate || !endDate) {
      toast({
        title: 'Error',
        description: 'Pilih tanggal mulai dan akhir',
        variant: 'destructive',
      });
      return;
    }
    refetch();
  };

  const handleExport = async (format: 'pdf' | 'csv') => {
    if (!reportData) {
      toast({
        title: 'Error',
        description: 'Generate laporan terlebih dahulu',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);

    try {
      const params = new URLSearchParams();
      if (classId && classId !== 'all') params.append('classId', classId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('format', format);

      const res = await fetch(`/api/reports/export?${params}`);
      
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `laporan-absensi-${startDate}-${endDate}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Berhasil',
        description: `Laporan ${format.toUpperCase()} berhasil diunduh`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal export laporan',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Laporan Absensi</h2>
        <p className="text-muted-foreground">
          Generate dan export laporan kehadiran siswa
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
          <CardDescription>
            Pilih kriteria untuk generate laporan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Kelas (Opsional)</Label>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua kelas</SelectItem>
                  {classes?.map((cls: any) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} - {cls.grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tanggal Mulai</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tanggal Akhir</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Laporan
                </>
              )}
            </Button>

            {reportData && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle>Hasil Laporan</CardTitle>
            <CardDescription>
              {reportData.summary.totalRecords} record ditemukan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Total Hadir</p>
                <p className="text-2xl font-bold text-green-600">
                  {reportData.summary.present}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Sakit</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reportData.summary.sick}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Izin</p>
                <p className="text-2xl font-bold text-blue-600">
                  {reportData.summary.permission}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Alfa</p>
                <p className="text-2xl font-bold text-red-600">
                  {reportData.summary.absent}
                </p>
              </div>
            </div>

            {/* Data Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Keterangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.records.map((record: any) => (
                  <TableRow key={record.id}>
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell className="font-medium">
                      {record.student.name}
                    </TableCell>
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
                    <TableCell>{record.note || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
