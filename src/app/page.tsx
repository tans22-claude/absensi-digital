import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, QrCode, BarChart3, Shield, Clock, Users, GraduationCap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Sistem Absensi Digital
            <span className="block text-blue-600 dark:text-blue-400">Modern & Aman</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Kelola kehadiran siswa dengan mudah menggunakan teknologi QR Code dan dashboard real-time
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/login">
              <Button size="lg" className="text-lg px-8">
                Masuk
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Daftar
              </Button>
            </Link>
            <Link href="/registration">
              <Button size="lg" variant="default" className="text-lg px-8 bg-green-600 hover:bg-green-700">
                <GraduationCap className="mr-2 h-5 w-5" />
                Pendaftaran Siswa Baru
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
          <Card>
            <CardHeader>
              <QrCode className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>QR Code Scan</CardTitle>
              <CardDescription>
                Absensi cepat dan akurat dengan teknologi QR Code
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Dashboard Real-time</CardTitle>
              <CardDescription>
                Pantau kehadiran siswa secara langsung dengan grafik interaktif
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Keamanan Tinggi</CardTitle>
              <CardDescription>
                Dilengkapi 2FA, enkripsi data, dan audit log lengkap
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Offline Mode</CardTitle>
              <CardDescription>
                Tetap bisa absen meski tanpa koneksi internet
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-teal-600 mb-4" />
              <CardTitle>Multi-Role</CardTitle>
              <CardDescription>
                Akses berbeda untuk admin, guru, siswa, dan orang tua
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-indigo-600 mb-4" />
              <CardTitle>Laporan Lengkap</CardTitle>
              <CardDescription>
                Export laporan ke PDF dan CSV dengan filter fleksibel
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="max-w-2xl mx-auto bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-2xl">Siap Memulai?</CardTitle>
              <CardDescription className="text-base">
                Daftar sekarang dan rasakan kemudahan mengelola absensi sekolah Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Mulai Gratis
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 Secure Attendance. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
