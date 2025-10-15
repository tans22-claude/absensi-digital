import { Metadata } from 'next';
import { RegistrationForm } from '@/components/registration/registration-form';
import { GraduationCap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pendaftaran Siswa Baru | Secure Attendance',
  description: 'Formulir pendaftaran siswa baru tahun ajaran baru',
};

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Pendaftaran Siswa Baru
          </h1>
          <p className="text-lg text-gray-600">
            Tahun Ajaran 2024/2025
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            📋 Persyaratan Pendaftaran:
          </h2>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Memiliki NISN (Nomor Induk Siswa Nasional) yang valid</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Email aktif untuk keperluan komunikasi dan login sistem</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Nomor HP orang tua/wali yang dapat dihubungi</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Mengisi semua data dengan lengkap dan benar</span>
            </li>
          </ul>
        </div>

        {/* Registration Form */}
        <RegistrationForm />

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Setelah mendaftar, silakan tunggu konfirmasi dari admin sekolah melalui email.
          </p>
          <p className="mt-2">
            Jika ada pertanyaan, hubungi admin sekolah Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
