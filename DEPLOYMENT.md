# 🚀 Deployment Guide

Panduan lengkap untuk deploy aplikasi Secure Attendance ke berbagai platform.

## 📋 Pre-deployment Checklist

- [ ] Environment variables sudah dikonfigurasi
- [ ] Database PostgreSQL sudah siap
- [ ] NEXTAUTH_SECRET sudah di-generate (gunakan `openssl rand -base64 32`)
- [ ] Google OAuth credentials sudah dibuat (opsional)
- [ ] Email SMTP sudah dikonfigurasi (opsional)
- [ ] Domain sudah siap (untuk production)

## 🌐 Vercel Deployment (Recommended)

### 1. Setup Database di Supabase/Railway

**Supabase:**
1. Buat project baru di [supabase.com](https://supabase.com)
2. Copy connection string dari Settings > Database
3. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

**Railway:**
1. Buat project baru di [railway.app](https://railway.app)
2. Add PostgreSQL service
3. Copy DATABASE_URL dari Variables tab

### 2. Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

Atau via Vercel Dashboard:
1. Import project dari GitHub
2. Set environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (your-domain.vercel.app)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID` (opsional)
   - `GOOGLE_CLIENT_SECRET` (opsional)
3. Deploy

### 3. Run Database Migrations

```bash
# Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed
```

## 🐳 Docker Deployment

### Development

```bash
docker-compose up -d
```

### Production

```bash
# Build image
docker build -t attendance-app:latest .

# Run with environment file
docker run -d \
  --name attendance-app \
  -p 3000:3000 \
  --env-file .env.production \
  attendance-app:latest
```

### Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml attendance
```

## ☁️ AWS Deployment

### AWS Elastic Beanstalk

1. Install EB CLI:
```bash
pip install awsebcli
```

2. Initialize EB:
```bash
eb init -p docker attendance-app
```

3. Create environment:
```bash
eb create attendance-prod
```

4. Set environment variables:
```bash
eb setenv DATABASE_URL="..." NEXTAUTH_SECRET="..."
```

5. Deploy:
```bash
eb deploy
```

### AWS ECS (Fargate)

1. Build and push image to ECR:
```bash
aws ecr create-repository --repository-name attendance-app
docker build -t attendance-app .
docker tag attendance-app:latest [ECR_URI]:latest
docker push [ECR_URI]:latest
```

2. Create task definition
3. Create ECS service
4. Configure load balancer
5. Set environment variables in task definition

## 🔧 VPS Deployment (Ubuntu)

### 1. Setup Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

### 2. Setup Database

```bash
sudo -u postgres psql

CREATE DATABASE attendance_db;
CREATE USER attendance_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE attendance_db TO attendance_user;
\q
```

### 3. Deploy Application

```bash
# Clone repository
git clone <your-repo-url> /var/www/attendance
cd /var/www/attendance

# Install dependencies
npm ci --production

# Setup environment
cp .env.example .env
nano .env  # Edit with your values

# Run migrations
npx prisma migrate deploy
npx prisma db seed

# Build application
npm run build

# Start with PM2
pm2 start npm --name "attendance" -- start
pm2 save
pm2 startup
```

### 4. Configure Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/attendance /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 📱 Mobile App (PWA)

PWA sudah built-in. Untuk install:

1. Buka aplikasi di browser mobile
2. Tap menu browser
3. Pilih "Add to Home Screen"
4. Aplikasi akan muncul seperti native app

## 🔄 CI/CD Setup

### GitHub Actions (Included)

File `.github/workflows/ci.yml` sudah include:
- Linting
- Type checking
- Unit tests
- E2E tests
- Build verification

### Auto-deploy ke Vercel

1. Connect repository di Vercel
2. Enable auto-deploy dari main branch
3. Setiap push akan otomatis deploy

### Auto-deploy ke VPS

Tambahkan GitHub Action:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/attendance
            git pull
            npm ci --production
            npm run build
            npx prisma migrate deploy
            pm2 restart attendance
```

## 🔐 Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables tidak di-commit
- [ ] NEXTAUTH_SECRET di-generate secara random
- [ ] Database password yang kuat
- [ ] Firewall dikonfigurasi (hanya port 80, 443, 22)
- [ ] SSH key-based authentication
- [ ] Regular security updates
- [ ] Backup database otomatis
- [ ] Rate limiting enabled
- [ ] CORS dikonfigurasi dengan benar

## 📊 Monitoring

### Setup Monitoring (Recommended)

1. **Sentry** untuk error tracking:
```bash
npm install @sentry/nextjs
```

2. **Vercel Analytics** (jika deploy di Vercel)

3. **PM2 Monitoring** (jika deploy di VPS):
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
```

4. **Database Monitoring**:
- Supabase: Built-in dashboard
- Railway: Built-in metrics
- Self-hosted: pgAdmin atau Grafana

## 🔄 Backup Strategy

### Database Backup

```bash
# Manual backup
pg_dump -U attendance_user attendance_db > backup_$(date +%Y%m%d).sql

# Restore
psql -U attendance_user attendance_db < backup_20240101.sql

# Automated backup (cron)
0 2 * * * pg_dump -U attendance_user attendance_db > /backups/db_$(date +\%Y\%m\%d).sql
```

### Application Backup

```bash
# Backup uploads/files
tar -czf uploads_backup.tar.gz /var/www/attendance/public/uploads

# Backup .env
cp .env .env.backup
```

## 🆘 Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Reset database (CAUTION!)
npx prisma migrate reset
```

### PM2 Issues

```bash
# View logs
pm2 logs attendance

# Restart
pm2 restart attendance

# Monitor
pm2 monit
```

## 📞 Support

Jika mengalami masalah deployment:
1. Check logs terlebih dahulu
2. Baca error message dengan teliti
3. Search di GitHub Issues
4. Buat issue baru dengan detail lengkap

---

**Happy Deploying! 🚀**
