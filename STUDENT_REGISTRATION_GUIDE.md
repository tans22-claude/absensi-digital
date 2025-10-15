# 🎓 Panduan Fitur Pendaftaran Siswa Baru

## 📋 Ringkasan

Fitur **Pendaftaran Siswa Baru** telah berhasil ditambahkan ke aplikasi Secure Attendance App. Siswa baru dapat mendaftar secara online melalui formulir yang telah disediakan.

---

## ✨ Fitur yang Ditambahkan

### 1. **Database Schema**
- Model `StudentRegistration` untuk menyimpan data pendaftaran
- Enum `RegistrationStatus`: PENDING, APPROVED, REJECTED
- Enum `Gender`: MALE, FEMALE
- Relasi dengan model `School`

### 2. **API Endpoint**
- **POST** `/api/registration` - Untuk submit pendaftaran baru
- **GET** `/api/registration` - Untuk admin melihat semua pendaftaran

### 3. **Halaman Pendaftaran**
- URL: `/registration`
- Form lengkap dengan validasi
- Desain modern dan responsif
- Notifikasi sukses/error

### 4. **Navigasi**
- Link di halaman utama (homepage)
- Link di halaman login
- Tombol "Pendaftaran Siswa Baru" dengan icon graduation cap

---

## 📝 Formulir Pendaftaran

### Data yang Dikumpulkan:

#### **Data Pribadi:**
1. Nama Lengkap
2. NISN (10 digit)
3. Jenis Kelamin
4. Tempat Lahir
5. Tanggal Lahir
6. Alamat Lengkap

#### **Data Orang Tua/Wali:**
7. Nama Orang Tua/Wali
8. Nomor HP Orang Tua/Wali

#### **Data Pendaftaran:**
9. Kelas yang Dituju (7-12)
10. Email Aktif
11. Password
12. Konfirmasi Password

---

## 🔐 Validasi

### Validasi Otomatis:
- ✅ NISN harus 10 digit angka
- ✅ Email harus format valid
- ✅ Password minimal 6 karakter
- ✅ Password dan konfirmasi harus sama
- ✅ Nomor HP 10-15 digit
- ✅ NISN tidak boleh duplikat
- ✅ Email tidak boleh duplikat

### Pesan Error:
- Jika NISN sudah terdaftar
- Jika email sudah digunakan
- Jika ada field yang tidak valid

---

## 🚀 Cara Deploy

### **1. Push Schema ke Database**

Setelah code di-push ke GitHub, Netlify akan otomatis deploy. Tapi Anda perlu push schema ke database dulu:

```bash
# Set environment variable
$env:DATABASE_URL="postgresql://neondb_owner:npg_unh0POiwzNk9@ep-shy-sun-a1nfg27s-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Push schema
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### **2. Deploy ke Netlify**

Code sudah di-push ke GitHub, Netlify akan otomatis detect dan deploy:

1. Buka https://app.netlify.com
2. Cek deployment status
3. Tunggu sampai selesai (2-3 menit)

### **3. Verifikasi**

Setelah deploy selesai:

1. **Buka aplikasi**: https://absensi-digital-app.netlify.app
2. **Klik "Pendaftaran Siswa Baru"** di homepage
3. **Test formulir** dengan data dummy
4. **Cek database** apakah data tersimpan

---

## 📱 Cara Menggunakan

### **Untuk Siswa Baru:**

1. Buka https://absensi-digital-app.netlify.app
2. Klik tombol **"Pendaftaran Siswa Baru"** (hijau dengan icon graduation cap)
3. Isi semua field dengan lengkap dan benar
4. Klik **"Daftar Sekarang"**
5. Tunggu notifikasi sukses
6. Akan otomatis redirect ke halaman login setelah 3 detik

### **Untuk Admin:**

1. Login sebagai admin
2. Akses endpoint `/api/registration` untuk melihat semua pendaftaran
3. Approve atau reject pendaftaran (fitur ini bisa ditambahkan nanti)

---

## 🎨 Desain & UI

### **Warna:**
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Error: Red (#EF4444)
- Background: Gradient blue-purple

### **Responsif:**
- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

### **Komponen:**
- Card dengan shadow
- Input fields dengan label
- Select dropdown
- Textarea untuk alamat
- Button dengan loading state
- Alert untuk notifikasi

---

## 🔄 Alur Pendaftaran

```
1. Siswa mengisi formulir
   ↓
2. Validasi di client-side
   ↓
3. Submit ke API /api/registration
   ↓
4. Validasi di server-side
   ↓
5. Cek duplikat NISN & Email
   ↓
6. Hash password
   ↓
7. Simpan ke database (status: PENDING)
   ↓
8. Return success response
   ↓
9. Tampilkan notifikasi sukses
   ↓
10. Redirect ke login page
```

---

## 🛠️ Troubleshooting

### **Error: "NISN sudah terdaftar"**
- Gunakan NISN yang berbeda
- Atau hubungi admin jika NISN benar

### **Error: "Email sudah terdaftar"**
- Gunakan email yang berbeda
- Atau login jika sudah punya akun

### **Error: "Gagal memproses pendaftaran"**
- Cek koneksi internet
- Refresh halaman dan coba lagi
- Hubungi admin jika masih error

### **Deployment Error**
Jika ada error saat deploy:

1. **Cek Netlify logs**
2. **Push schema ke database** (penting!)
3. **Regenerate Prisma client**
4. **Redeploy**

---

## 📊 Database Schema

```prisma
model StudentRegistration {
  id                String              @id @default(cuid())
  fullName          String
  nisn              String              @unique
  gender            Gender
  birthPlace        String
  birthDate         DateTime
  address           String              @db.Text
  parentName        String
  parentPhone       String
  targetGrade       String
  email             String              @unique
  passwordHash      String
  status            RegistrationStatus  @default(PENDING)
  schoolId          String?
  school            School?             @relation(fields: [schoolId], references: [id])
  registeredAt      DateTime            @default(now())
  processedAt       DateTime?
  processedBy       String?
  rejectionReason   String?             @db.Text
  notes             String?             @db.Text
}

enum RegistrationStatus {
  PENDING
  APPROVED
  REJECTED
}

enum Gender {
  MALE
  FEMALE
}
```

---

## 🎯 Fitur Tambahan (Opsional)

Fitur-fitur yang bisa ditambahkan nanti:

1. **Admin Dashboard** untuk manage pendaftaran
2. **Email notification** saat pendaftaran berhasil
3. **Upload dokumen** (foto, ijazah, dll)
4. **Payment gateway** untuk biaya pendaftaran
5. **Interview scheduling** untuk siswa yang approved
6. **Bulk import** siswa dari CSV/Excel
7. **Print formulir** pendaftaran

---

## 📞 Support

Jika ada pertanyaan atau masalah:

1. Cek dokumentasi ini terlebih dahulu
2. Lihat error message di console browser
3. Cek Netlify deployment logs
4. Hubungi developer

---

## ✅ Checklist Deployment

- [x] Database schema updated
- [x] API route created
- [x] Form component created
- [x] Registration page created
- [x] Navigation links added
- [x] Code pushed to GitHub
- [ ] Schema pushed to database (Anda yang lakukan)
- [ ] Tested on production
- [ ] Admin notified

---

## 🎉 Selamat!

Fitur **Pendaftaran Siswa Baru** sudah siap digunakan!

**URL Pendaftaran**: https://absensi-digital-app.netlify.app/registration

---

*Dibuat dengan ❤️ untuk Secure Attendance App*
*Last Updated: October 15, 2025*
