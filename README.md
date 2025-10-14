# 🎓 Secure Attendance - Sistem Absensi Digital Sekolah

Aplikasi absensi digital yang modern, aman, dan mudah digunakan untuk sekolah. Dilengkapi dengan fitur QR Code scanning, dashboard real-time, laporan lengkap, dan keamanan tingkat tinggi.

## ✨ Fitur Utama

### 🔐 Keamanan & Autentikasi
- **Multi-role Authentication**: Superadmin, Admin, Guru, Siswa, Orang Tua
- **2FA (Two-Factor Authentication)**: TOTP-based untuk admin
- **OAuth Integration**: Login dengan Google
- **Password Security**: Bcrypt hashing, password strength validation
- **Rate Limiting**: Proteksi terhadap brute force attacks
- **CSRF Protection**: Token-based CSRF protection
- **Audit Logging**: Pencatatan lengkap semua aktivitas

### 📱 Absensi
- **QR Code Scanning**: Absensi cepat dengan scan QR Code
- **Manual Input**: Input absensi manual oleh guru
- **Offline Mode**: Tetap bisa absen tanpa internet, sinkron otomatis
- **Real-time Updates**: Notifikasi langsung saat absensi tercatat
- **Multiple Status**: Hadir, Sakit, Izin, Alfa

### 📊 Dashboard & Laporan
- **Dashboard Interaktif**: Statistik real-time dengan grafik
- **Laporan Lengkap**: Export ke PDF dan CSV
- **Filter Fleksibel**: Per kelas, siswa, tanggal
- **Grafik Tren**: Visualisasi kehadiran harian/bulanan
- **Notifikasi**: Alert untuk absensi tidak wajar

### 🎨 UI/UX
- **Modern Design**: Clean, elegant, professional
- **Responsive**: Mobile-first, tablet, desktop
- **Dark Mode**: Toggle dark/light theme
- **Accessibility**: WCAG compliant, keyboard navigation
- **PWA Support**: Install sebagai aplikasi mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes, tRPC-ready
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Real-time**: WebSocket/Server-Sent Events
- **QR Code**: qrcode, html5-qrcode
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand, TanStack Query
- **Testing**: Jest, Playwright
- **DevOps**: Docker, GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ dan npm 9+
- PostgreSQL 15+
- Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Salin `.env.example` ke `.env` dan sesuaikan:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/attendance_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Setup Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database dengan data sample
npm run prisma:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Deployment

### Development dengan Docker Compose

```bash
docker-compose up -d
```

### Production Build

```bash
# Build image
docker build -t attendance-app .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  attendance-app
```

## 📝 Default Login Credentials

Setelah seed database:

- **Super Admin**: `admin@attendance.com` / `password123`
- **Admin Sekolah**: `admin@sman1jakarta.sch.id` / `password123`
- **Guru 1**: `guru1@sman1jakarta.sch.id` / `password123`
- **Guru 2**: `guru2@sman1jakarta.sch.id` / `password123`

⚠️ **PENTING**: Ganti password default setelah login pertama!

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### E2E Tests

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:ci
```

## 📦 Build for Production

```bash
# Build aplikasi
npm run build

# Start production server
npm start
```

## 🌐 Deployment

### Vercel (Recommended untuk Frontend)

1. Push ke GitHub
2. Import project di Vercel
3. Set environment variables
4. Deploy

### Railway (Recommended untuk Database + Backend)

1. Create new project di Railway
2. Add PostgreSQL database
3. Deploy from GitHub
4. Set environment variables

### Manual VPS Deployment

```bash
# Clone repository
git clone <repo-url>
cd app

# Install dependencies
npm ci --production

# Build
npm run build

# Setup PM2
npm install -g pm2
pm2 start npm --name "attendance-app" -- start
pm2 save
pm2 startup
```

## 📚 API Documentation

API documentation tersedia di `/api/docs` (Swagger UI) setelah aplikasi berjalan.

### Key Endpoints

- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login
- `GET /api/dashboard/stats` - Dashboard statistics
- `POST /api/attendance/qr-scan` - Submit QR attendance
- `POST /api/attendance/bulk` - Bulk attendance input
- `GET /api/attendance/history` - Attendance history
- `GET /api/reports/export` - Export reports

## 🔧 Configuration

### Environment Variables

Lihat `.env.example` untuk daftar lengkap environment variables.

### Feature Flags

```env
ENABLE_2FA=true
ENABLE_QR_ATTENDANCE=true
ENABLE_OFFLINE_MODE=true
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

Untuk bantuan dan pertanyaan:
- Email: support@attendance.com
- Documentation: [docs.attendance.com](https://docs.attendance.com)
- Issues: [GitHub Issues](https://github.com/...)

## 🙏 Acknowledgments

- Next.js team untuk framework yang luar biasa
- shadcn untuk UI components
- Prisma team untuk ORM yang powerful
- Semua contributors dan pengguna aplikasi ini

---

**Made with ❤️ for Indonesian Schools**
