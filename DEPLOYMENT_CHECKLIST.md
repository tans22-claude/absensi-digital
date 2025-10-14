# 🚀 Deployment Checklist

## Pre-Deployment

- [x] Code sudah di-push ke GitHub
- [x] Database PostgreSQL sudah setup (Neon)
- [x] Environment variables sudah disiapkan
- [ ] Build test lokal: `npm run build`
- [ ] Ganti password default di database

## Environment Variables untuk Production

```env
DATABASE_URL=postgresql://neondb_owner:npg_unh0POiwzNk9@ep-shy-sun-a1nfg27s-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

NEXTAUTH_SECRET=secure-attendance-secret-key-2024

NEXTAUTH_URL=https://your-domain.vercel.app

# Optional
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
```

## Vercel Deployment Steps

1. **Login ke Vercel**
   - https://vercel.com
   - Login dengan GitHub

2. **Import Project**
   - New Project → Import Git Repository
   - Select: `tans22-claude/app`

3. **Configure**
   - Framework: Next.js (auto-detect)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Install Command: `npm install`

4. **Environment Variables**
   - Add semua variables di atas
   - Pilih: Production, Preview, Development

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes

6. **Post-Deployment**
   - Copy URL yang diberikan
   - Update `NEXTAUTH_URL` dengan URL tersebut
   - Redeploy (otomatis)

## Post-Deployment

- [ ] Test login
- [ ] Test semua fitur
- [ ] Ganti password admin
- [ ] Setup custom domain (optional)
- [ ] Enable analytics (optional)

## Custom Domain (Optional)

1. Di Vercel Dashboard → Settings → Domains
2. Add domain Anda
3. Update DNS records sesuai instruksi
4. Wait for SSL certificate (auto)

## Monitoring

- Vercel Analytics: Built-in
- Error tracking: Check Vercel logs
- Database monitoring: Neon dashboard

## Troubleshooting

### Build Error
```bash
# Test build locally first
npm run build

# Check logs di Vercel dashboard
```

### Database Connection Error
- Check DATABASE_URL di environment variables
- Pastikan Neon database masih aktif
- Check connection string format

### Authentication Error
- Check NEXTAUTH_SECRET
- Check NEXTAUTH_URL (harus HTTPS)
- Clear browser cookies

## Security Checklist

- [ ] NEXTAUTH_SECRET menggunakan random string
- [ ] Database password yang kuat
- [ ] Ganti semua password default
- [ ] Enable 2FA untuk admin accounts
- [ ] Review environment variables

## Performance

- Vercel automatically handles:
  - Image optimization
  - Code splitting
  - CDN caching
  - Edge functions

## Cost

- **Vercel Free Tier:**
  - Unlimited deployments
  - 100GB bandwidth/month
  - Serverless functions
  - SSL certificate

- **Neon Free Tier:**
  - 0.5GB storage
  - 1 project
  - Auto-suspend after inactivity

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Neon Docs: https://neon.tech/docs

---

**Ready to deploy!** 🚀
