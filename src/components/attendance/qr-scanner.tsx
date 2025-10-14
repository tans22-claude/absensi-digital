'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, Loader2 } from 'lucide-react';

export function QRScanner() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerIdRef = useRef('qr-reader-' + Math.random().toString(36).substr(2, 9));

  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode(readerIdRef.current);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          if (isProcessing) return;

          setIsProcessing(true);

          try {
            // Parse QR data
            const qrData = JSON.parse(decodedText);

            // Validate QR code
            if (qrData.type !== 'attendance') {
              throw new Error('QR Code tidak valid');
            }

            if (Date.now() > qrData.expires) {
              throw new Error('QR Code sudah kadaluarsa');
            }

            // Submit attendance
            const response = await fetch('/api/attendance/qr-scan', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                classId: qrData.classId,
                qrData: decodedText,
              }),
            });

            const result = await response.json();

            if (!response.ok) {
              throw new Error(result.error || 'Gagal submit absensi');
            }

            toast({
              title: 'Absensi Berhasil!',
              description: 'Kehadiran Anda telah tercatat',
            });

            // Stop scanning after successful scan
            await stopScanning();
          } catch (error: any) {
            toast({
              title: 'Error',
              description: error.message,
              variant: 'destructive',
            });
          } finally {
            setIsProcessing(false);
          }
        },
        (errorMessage) => {
          // Ignore scan errors (happens frequently)
        }
      );

      setIsScanning(true);
    } catch (error: any) {
      console.error('Scanner error:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengakses kamera. Pastikan izin kamera diberikan.',
        variant: 'destructive',
      });
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (error) {
        console.error('Stop scanner error:', error);
      }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div
        id={readerIdRef.current}
        className={`${isScanning ? 'block' : 'hidden'} w-full max-w-md mx-auto`}
      />

      {!isScanning && (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
          <Camera className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            Klik tombol di bawah untuk mulai scan QR Code
          </p>
        </div>
      )}

      <div className="flex justify-center gap-2">
        {!isScanning ? (
          <Button onClick={startScanning} disabled={isProcessing}>
            <Camera className="mr-2 h-4 w-4" />
            Mulai Scan
          </Button>
        ) : (
          <Button onClick={stopScanning} variant="destructive" disabled={isProcessing}>
            <CameraOff className="mr-2 h-4 w-4" />
            Stop Scan
          </Button>
        )}
      </div>

      {isProcessing && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Memproses absensi...
        </div>
      )}
    </div>
  );
}
