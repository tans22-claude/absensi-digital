/**
 * Database Seed Script
 * Populates the database with sample data for testing
 */

import { PrismaClient, UserRole, AttendanceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create school
  const school = await prisma.school.upsert({
    where: { id: 'school-1' },
    update: {},
    create: {
      id: 'school-1',
      name: 'SMA Negeri 1 Jakarta',
      address: 'Jl. Pendidikan No. 123, Jakarta',
      timezone: 'Asia/Jakarta',
      phone: '021-1234567',
      email: 'info@sman1jakarta.sch.id',
    },
  });

  console.log('✅ School created:', school.name);

  // Create users
  const passwordHash = await bcrypt.hash('password123', 12);

  const superadmin = await prisma.user.upsert({
    where: { email: 'admin@attendance.com' },
    update: {},
    create: {
      email: 'admin@attendance.com',
      name: 'Super Admin',
      passwordHash,
      role: 'SUPERADMIN',
      schoolId: school.id,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@sman1jakarta.sch.id' },
    update: {},
    create: {
      email: 'admin@sman1jakarta.sch.id',
      name: 'Admin Sekolah',
      passwordHash,
      role: 'ADMIN',
      schoolId: school.id,
    },
  });

  const teacher1 = await prisma.user.upsert({
    where: { email: 'guru1@sman1jakarta.sch.id' },
    update: {},
    create: {
      email: 'guru1@sman1jakarta.sch.id',
      name: 'Budi Santoso',
      passwordHash,
      role: 'TEACHER',
      schoolId: school.id,
    },
  });

  const teacher2 = await prisma.user.upsert({
    where: { email: 'guru2@sman1jakarta.sch.id' },
    update: {},
    create: {
      email: 'guru2@sman1jakarta.sch.id',
      name: 'Siti Nurhaliza',
      passwordHash,
      role: 'TEACHER',
      schoolId: school.id,
    },
  });

  console.log('✅ Users created');

  // Create classes
  const class10A = await prisma.class.upsert({
    where: { id: 'class-10a' },
    update: {},
    create: {
      id: 'class-10a',
      schoolId: school.id,
      name: '10-A',
      grade: '10',
      teacherId: teacher1.id,
      academicYear: '2024/2025',
    },
  });

  const class10B = await prisma.class.upsert({
    where: { id: 'class-10b' },
    update: {},
    create: {
      id: 'class-10b',
      schoolId: school.id,
      name: '10-B',
      grade: '10',
      teacherId: teacher2.id,
      academicYear: '2024/2025',
    },
  });

  console.log('✅ Classes created');

  // Create students
  const studentNames = [
    'Ahmad Fauzi',
    'Dewi Lestari',
    'Rizky Pratama',
    'Sari Wulandari',
    'Andi Wijaya',
    'Putri Rahayu',
    'Dimas Saputra',
    'Fitri Handayani',
    'Eko Prasetyo',
    'Rina Susanti',
  ];

  for (let i = 0; i < studentNames.length; i++) {
    const classId = i < 5 ? class10A.id : class10B.id;
    const nis = `2024${(i + 1).toString().padStart(4, '0')}`;

    await prisma.student.upsert({
      where: { nis },
      update: {},
      create: {
        nis,
        name: studentNames[i],
        schoolId: school.id,
        classId,
        gender: i % 2 === 0 ? 'L' : 'P',
        dateOfBirth: new Date(2008, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      },
    });
  }

  console.log('✅ Students created');

  // Create schedules
  const subjects = ['Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'Fisika', 'Kimia'];
  
  for (let day = 1; day <= 5; day++) {
    for (let i = 0; i < 2; i++) {
      await prisma.schedule.create({
        data: {
          schoolId: school.id,
          classId: class10A.id,
          subject: subjects[i],
          dayOfWeek: day,
          startTime: `${7 + i * 2}:00`,
          endTime: `${8 + i * 2}:30`,
          teacherId: i % 2 === 0 ? teacher1.id : teacher2.id,
          room: `R-${i + 1}`,
        },
      });
    }
  }

  console.log('✅ Schedules created');

  // Create sample attendance records
  const students = await prisma.student.findMany({ take: 10 });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const student of students) {
    await prisma.attendance.create({
      data: {
        studentId: student.id,
        classId: student.classId,
        date: today,
        status: Math.random() > 0.2 ? 'PRESENT' : 'ABSENT',
        recordedBy: teacher1.id,
        method: 'QR_SCAN',
      },
    });
  }

  console.log('✅ Sample attendance created');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Login credentials:');
  console.log('   Super Admin: admin@attendance.com / password123');
  console.log('   Admin: admin@sman1jakarta.sch.id / password123');
  console.log('   Teacher 1: guru1@sman1jakarta.sch.id / password123');
  console.log('   Teacher 2: guru2@sman1jakarta.sch.id / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
