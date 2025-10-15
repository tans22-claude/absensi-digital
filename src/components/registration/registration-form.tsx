'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormData {
  fullName: string;
  nisn: string;
  gender: string;
  birthPlace: string;
  birthDate: string;
  address: string;
  parentName: string;
  parentPhone: string;
  targetGrade: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialFormData: FormData = {
  fullName: '',
  nisn: '',
  gender: '',
  birthPlace: '',
  birthDate: '',
  address: '',
  parentName: '',
  parentPhone: '',
  targetGrade: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export function RegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      setLoading(false);
      return;
    }

    // Validate NISN (must be 10 digits)
    if (!/^\d{10}$/.test(formData.nisn)) {
      setError('NISN harus 10 digit angka');
      setLoading(false);
      return;
    }

    // Validate phone number
    if (!/^\d{10,15}$/.test(formData.parentPhone)) {
      setError('Nomor HP harus 10-15 digit angka');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          nisn: formData.nisn,
          gender: formData.gender,
          birthPlace: formData.birthPlace,
          birthDate: formData.birthDate,
          address: formData.address,
          parentName: formData.parentName,
          parentPhone: formData.parentPhone,
          targetGrade: formData.targetGrade,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memproses pendaftaran');
      }

      setSuccess(true);
      setFormData(initialFormData);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800 ml-2">
              <strong>Pendaftaran siswa baru berhasil!</strong>
              <p className="mt-2">
                Silakan tunggu konfirmasi dari admin sekolah. Anda akan diarahkan ke halaman login...
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Pendaftaran Siswa Baru</CardTitle>
        <CardDescription>
          Lengkapi formulir di bawah ini untuk mendaftar sebagai siswa baru
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Data Pribadi */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Data Pribadi</h3>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap *</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nisn">NISN (Nomor Induk Siswa Nasional) *</Label>
              <Input
                id="nisn"
                name="nisn"
                value={formData.nisn}
                onChange={handleChange}
                placeholder="10 digit NISN"
                maxLength={10}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Jenis Kelamin *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange('gender', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Laki-laki</SelectItem>
                  <SelectItem value="FEMALE">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthPlace">Tempat Lahir *</Label>
                <Input
                  id="birthPlace"
                  name="birthPlace"
                  value={formData.birthPlace}
                  onChange={handleChange}
                  placeholder="Kota kelahiran"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Tanggal Lahir *</Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap *</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Data Orang Tua/Wali */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Data Orang Tua/Wali</h3>

            <div className="space-y-2">
              <Label htmlFor="parentName">Nama Orang Tua/Wali *</Label>
              <Input
                id="parentName"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                placeholder="Nama lengkap orang tua/wali"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentPhone">Nomor HP Orang Tua/Wali *</Label>
              <Input
                id="parentPhone"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>
          </div>

          {/* Data Pendaftaran */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Data Pendaftaran</h3>

            <div className="space-y-2">
              <Label htmlFor="targetGrade">Kelas yang Dituju *</Label>
              <Select
                value={formData.targetGrade}
                onValueChange={(value) => handleSelectChange('targetGrade', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Kelas 7 (SMP)</SelectItem>
                  <SelectItem value="8">Kelas 8 (SMP)</SelectItem>
                  <SelectItem value="9">Kelas 9 (SMP)</SelectItem>
                  <SelectItem value="10">Kelas 10 (SMA)</SelectItem>
                  <SelectItem value="11">Kelas 11 (SMA)</SelectItem>
                  <SelectItem value="12">Kelas 12 (SMA)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Aktif *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Ulangi password"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} disabled={loading}>
              Reset Form
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Sudah punya akun?{' '}
            <a href="/auth/login" className="text-primary hover:underline">
              Login di sini
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
