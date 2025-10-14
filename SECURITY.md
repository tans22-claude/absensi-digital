# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

Kami sangat menghargai peneliti keamanan dan pengguna yang melaporkan kerentanan keamanan. Jika Anda menemukan kerentanan keamanan, **JANGAN** membuat public issue.

### Cara Melaporkan

1. **Email**: Kirim detail ke security@attendance.com
2. **Subject**: "Security Vulnerability Report"
3. **Include**:
   - Deskripsi kerentanan
   - Langkah-langkah untuk reproduce
   - Potensi dampak
   - Saran perbaikan (jika ada)

### Response Timeline

- **24 jam**: Konfirmasi penerimaan laporan
- **72 jam**: Penilaian awal dan severity rating
- **7 hari**: Update progress perbaikan
- **30 hari**: Target resolusi untuk critical issues

### Disclosure Policy

- Kami akan bekerja dengan Anda untuk memahami dan mengatasi masalah
- Kami akan memberikan credit kepada pelapor (jika diinginkan)
- Mohon tunggu hingga patch dirilis sebelum public disclosure
- Kami akan mengumumkan fix di CHANGELOG dan security advisories

## Security Measures

### Authentication & Authorization

- ✅ Password hashing dengan bcrypt (cost factor 12)
- ✅ JWT-based session management
- ✅ 2FA support dengan TOTP
- ✅ Role-based access control (RBAC)
- ✅ Session expiration dan refresh
- ✅ OAuth integration (Google)

### Data Protection

- ✅ Encryption at rest (database level)
- ✅ Encryption in transit (HTTPS/TLS)
- ✅ Secure headers (X-Frame-Options, CSP, etc.)
- ✅ Input validation dengan Zod
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS protection
- ✅ CSRF protection

### API Security

- ✅ Rate limiting (100 req/15min default)
- ✅ Request validation
- ✅ Authentication required untuk protected routes
- ✅ API key rotation support
- ✅ Audit logging

### Infrastructure

- ✅ Environment variables untuk secrets
- ✅ No hardcoded credentials
- ✅ Secure cookie settings
- ✅ HTTPS enforcement
- ✅ Security headers via middleware

### Monitoring & Logging

- ✅ Audit logs untuk semua critical actions
- ✅ Failed login attempt tracking
- ✅ Error logging (tanpa sensitive data)
- ✅ Security event monitoring

## Best Practices untuk Deployment

### 1. Environment Variables

```bash
# JANGAN commit .env ke git
# Gunakan secrets management (Vercel Secrets, AWS Secrets Manager, etc.)
```

### 2. Database Security

```bash
# Gunakan SSL/TLS untuk database connection
DATABASE_URL="postgresql://...?sslmode=require"

# Gunakan strong password
# Minimal 16 karakter, kombinasi huruf, angka, simbol
```

### 3. HTTPS Only

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    return 301 https://$host$request_uri;
}
```

### 4. Security Headers

Sudah dikonfigurasi di `next.config.js`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy

### 5. Regular Updates

```bash
# Update dependencies secara berkala
npm audit
npm audit fix

# Check untuk security advisories
npm outdated
```

### 6. Backup Strategy

- Database backup harian
- Retention policy 30 hari
- Test restore procedure
- Encrypted backups

### 7. Access Control

- Principle of least privilege
- Regular access review
- Revoke unused accounts
- Strong password policy

## Security Checklist untuk Production

- [ ] HTTPS enabled dengan valid SSL certificate
- [ ] Environment variables dikonfigurasi dengan aman
- [ ] Database password yang kuat
- [ ] NEXTAUTH_SECRET di-generate secara random
- [ ] Rate limiting enabled
- [ ] Firewall dikonfigurasi
- [ ] Backup otomatis berjalan
- [ ] Monitoring dan alerting setup
- [ ] Security headers configured
- [ ] Dependencies up-to-date
- [ ] Audit logging enabled
- [ ] Error tracking setup (Sentry)
- [ ] 2FA enabled untuk admin accounts
- [ ] Regular security audits scheduled

## Vulnerability Disclosure Timeline

Kami berkomitmen untuk:
- Merespons laporan dalam 24 jam
- Merilis patch untuk critical issues dalam 7 hari
- Merilis patch untuk high severity dalam 30 hari
- Memberikan credit kepada security researchers

## Security Updates

Subscribe ke security advisories:
- GitHub Security Advisories
- Email newsletter
- RSS feed

## Contact

- Security Email: security@attendance.com
- General Support: support@attendance.com

## Acknowledgments

Terima kasih kepada security researchers yang telah membantu meningkatkan keamanan aplikasi ini.

---

**Last Updated**: 2024-01-15
