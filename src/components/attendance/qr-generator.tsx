'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRCodeGeneratorProps {
  classId: string;
}

export function QRCodeGenerator({ classId }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [qrData, setQrData] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  const generateQR = async () => {
    try {
      // Generate QR data with timestamp and class info
      const timestamp = Date.now();
      const expires = new Date(timestamp + 5 * 60 * 1000); // 5 minutes validity
      const data = JSON.stringify({
        classId,
        timestamp,
        expires: expires.getTime(),
        type: 'attendance',
      });

      setQrData(data);
      setExpiresAt(expires);

      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, data, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
      }

      toast({
        title: 'QR Code Generated',
        description: 'QR Code valid selama 5 menit',
      });
    } catch (error) {
      console.error('QR generation error:', error);
      toast({
        title: 'Error',
        description: 'Gagal generate QR Code',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (classId) {
      generateQR();
      
      // Auto-refresh every 4 minutes
      const interval = setInterval(generateQR, 4 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [classId]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <Card className="p-4 bg-white">
        <canvas ref={canvasRef} />
      </Card>

      {expiresAt && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            QR Code berlaku hingga: {expiresAt.toLocaleTimeString('id-ID')}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={generateQR}
            className="mt-2"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh QR Code
          </Button>
        </div>
      )}

      <div className="text-center max-w-md">
        <p className="text-sm text-muted-foreground">
          Siswa dapat scan QR Code ini untuk melakukan absensi. QR Code akan
          otomatis diperbarui setiap 4 menit untuk keamanan.
        </p>
      </div>
    </div>
  );
}
