# Contributing to Secure Attendance

Terima kasih atas minat Anda untuk berkontribusi! 🎉

## Code of Conduct

Proyek ini mengikuti kode etik yang ramah dan inklusif. Dengan berpartisipasi, Anda diharapkan menjunjung tinggi kode etik ini.

## Cara Berkontribusi

### Melaporkan Bug

1. Pastikan bug belum dilaporkan dengan mencari di [Issues](https://github.com/...)
2. Buat issue baru dengan template bug report
3. Sertakan informasi:
   - Deskripsi jelas tentang bug
   - Langkah-langkah untuk reproduce
   - Expected vs actual behavior
   - Screenshots jika relevan
   - Environment (OS, browser, Node version)

### Mengusulkan Fitur

1. Buat issue dengan template feature request
2. Jelaskan use case dan manfaatnya
3. Diskusikan dengan maintainers sebelum mulai coding

### Pull Request Process

1. **Fork** repository
2. **Clone** fork Anda:
   ```bash
   git clone https://github.com/your-username/attendance-app.git
   ```

3. **Create branch** untuk fitur/fix:
   ```bash
   git checkout -b feature/amazing-feature
   # atau
   git checkout -b fix/bug-description
   ```

4. **Setup development environment**:
   ```bash
   npm install
   cp .env.example .env
   # Edit .env dengan konfigurasi lokal
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. **Make changes** dengan mengikuti coding standards

6. **Test** perubahan Anda:
   ```bash
   npm run lint
   npm run type-check
   npm test
   npm run test:e2e
   ```

7. **Commit** dengan pesan yang jelas:
   ```bash
   git commit -m "feat: add amazing feature"
   # atau
   git commit -m "fix: resolve bug in attendance"
   ```

   Gunakan conventional commits:
   - `feat:` untuk fitur baru
   - `fix:` untuk bug fixes
   - `docs:` untuk dokumentasi
   - `style:` untuk formatting
   - `refactor:` untuk refactoring
   - `test:` untuk testing
   - `chore:` untuk maintenance

8. **Push** ke fork Anda:
   ```bash
   git push origin feature/amazing-feature
   ```

9. **Create Pull Request** di GitHub

### PR Guidelines

- Satu PR untuk satu fitur/fix
- Update dokumentasi jika diperlukan
- Tambahkan tests untuk fitur baru
- Pastikan semua tests pass
- Ikuti code style yang ada
- Tulis deskripsi PR yang jelas

## Development Guidelines

### Code Style

- TypeScript strict mode
- ESLint rules harus diikuti
- Prettier untuk formatting
- Meaningful variable names
- Comments untuk logic kompleks

### File Structure

```
src/
├── app/              # Next.js app router
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── ...          # Feature components
├── lib/             # Utility functions
└── ...
```

### Component Guidelines

```typescript
// Good: Functional component with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={variant}>
      {label}
    </button>
  );
}
```

### API Route Guidelines

```typescript
// Good: Proper error handling and validation
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = schema.parse(body);

    // Business logic here

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### Testing Guidelines

- Write tests untuk semua fitur baru
- Minimum 60% code coverage
- Unit tests untuk utility functions
- Integration tests untuk API routes
- E2E tests untuk critical user flows

```typescript
// Example test
describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('15 Jan 2024');
  });
});
```

## Database Changes

Jika mengubah schema:

1. Update `prisma/schema.prisma`
2. Create migration:
   ```bash
   npx prisma migrate dev --name description
   ```
3. Update seed data jika perlu
4. Update TypeScript types

## Documentation

- Update README.md untuk fitur besar
- Update API_DOCUMENTATION.md untuk API changes
- Add inline comments untuk logic kompleks
- Update CHANGELOG.md

## Review Process

1. Maintainer akan review PR Anda
2. Mungkin ada request untuk changes
3. Setelah approved, PR akan di-merge
4. Branch akan di-delete setelah merge

## Questions?

Jangan ragu untuk:
- Buat issue untuk pertanyaan
- Join Discord community (jika ada)
- Email maintainers

## Recognition

Contributors akan ditambahkan ke:
- README.md contributors section
- CHANGELOG.md
- GitHub contributors page

Terima kasih atas kontribusi Anda! 🙏
