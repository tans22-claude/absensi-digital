'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Settings, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pengaturan</h2>
        <p className="text-muted-foreground">
          Kelola preferensi dan keamanan akun Anda
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Informasi akun Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nama</Label>
            <Input value={session?.user?.name || ''} disabled />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={session?.user?.email || ''} disabled />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={session?.user?.role || ''} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keamanan</CardTitle>
          <CardDescription>Pengaturan keamanan akun</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">
            <Shield className="mr-2 h-4 w-4" />
            Aktifkan 2FA
          </Button>
          <Button variant="outline">Ubah Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
