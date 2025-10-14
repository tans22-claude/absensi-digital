# 🚀 Quick Start Guide

Panduan cepat untuk menjalankan aplikasi Secure Attendance di lokal.

## Prerequisites

- Node.js 18+ dan npm 9+
- PostgreSQL 15+

## Setup dalam 5 Menit

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Buat database PostgreSQL:

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE attendance_db;

# Keluar
\q
```

### 3. Configure Environment

```bash
# Copy environment file
cp .env.example .env
```

Edit `.env` dan sesuaikan `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/attendance_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

Generate NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

### 4. Run Migrations & Seed

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database dengan data sample
npm run prisma:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Login Credentials

Setelah seed, gunakan credentials berikut:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@attendance.com | password123 |
| Admin Sekolah | admin@sman1jakarta.sch.id | password123 |
| Guru 1 | guru1@sman1jakarta.sch.id | password123 |
| Guru 2 | guru2@sman1jakarta.sch.id | password123 |

⚠️ **PENTING**: Ganti password setelah login pertama!

## Fitur yang Bisa Dicoba

### Sebagai Guru:
1. Login dengan akun guru
2. Buka menu **Absensi**
3. Pilih tab **QR Code**
4. Pilih kelas dan generate QR Code
5. Atau gunakan tab **Manual** untuk input absensi manual

### Sebagai Admin:
1. Login dengan akun admin
2. Lihat **Dashboard** dengan statistik real-time
3. Buka **Laporan** untuk generate dan export laporan
4. Kelola **Pengguna** di menu Users

## Docker Quick Start

Jika prefer menggunakan Docker:

```bash
# Start semua services
docker-compose up -d

# Lihat logs
docker-compose logs -f

# Stop services
docker-compose down
```

Database dan aplikasi akan berjalan otomatis di:
- App: http://localhost:3000
- Database: localhost:5432

## Troubleshooting

### Database Connection Error

```bash
# Pastikan PostgreSQL berjalan
sudo systemctl status postgresql

# Atau di Windows
services.msc # Cari PostgreSQL service
```

### Port 3000 Already in Use

```bash
# Kill process di port 3000
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Prisma Migration Error

```bash
# Reset database (HATI-HATI: menghapus semua data)
npm run prisma:migrate reset

# Atau manual
npx prisma migrate reset
```

## Next Steps

- Baca [README.md](./README.md) untuk dokumentasi lengkap
- Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk panduan deployment
- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) untuk API reference

## Support

Jika ada masalah, check:
1. Logs di terminal
2. Browser console (F12)
3. Database connection
4. Environment variables

Happy coding! 🎉
