'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { QRCodeGenerator } from './qr-generator';
import { QRScanner } from './qr-scanner';
import { useQuery } from '@tanstack/react-query';

export function QRAttendance() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [mode, setMode] = useState<'generate' | 'scan'>('scan');

  const isTeacher = session?.user?.role === 'TEACHER' || session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPERADMIN';

  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await fetch('/api/classes');
      if (!res.ok) throw new Error('Failed to fetch classes');
      return res.json();
    },
    enabled: isTeacher,
  });

  useEffect(() => {
    if (isTeacher) {
      setMode('generate');
    } else {
      setMode('scan');
    }
  }, [isTeacher]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Teacher: Generate QR */}
      {isTeacher && mode === 'generate' && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Generate QR Code Absensi</CardTitle>
            <CardDescription>
              Tampilkan QR Code untuk siswa scan absensi
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

            {selectedClass && <QRCodeGenerator classId={selectedClass} />}
          </CardContent>
        </Card>
      )}

      {/* Student: Scan QR */}
      {mode === 'scan' && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Scan QR Code Absensi</CardTitle>
            <CardDescription>
              Arahkan kamera ke QR Code yang ditampilkan guru
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QRScanner />
          </CardContent>
        </Card>
      )}

      {/* Toggle for teachers */}
      {isTeacher && (
        <div className="md:col-span-2 flex justify-center gap-2">
          <Button
            variant={mode === 'generate' ? 'default' : 'outline'}
            onClick={() => setMode('generate')}
          >
            Generate QR
          </Button>
          <Button
            variant={mode === 'scan' ? 'default' : 'outline'}
            onClick={() => setMode('scan')}
          >
            Scan QR
          </Button>
        </div>
      )}
    </div>
  );
}
