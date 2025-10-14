import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const exportFormat = searchParams.get('format') || 'pdf';

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const where: any = {
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    };

    if (classId) {
      where.classId = classId;
    }

    if (session.user.schoolId) {
      where.student = { schoolId: session.user.schoolId };
    }

    const records = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          select: {
            name: true,
            nis: true,
          },
        },
        class: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    if (exportFormat === 'csv') {
      // Generate CSV
      const csvHeaders = ['Tanggal', 'NIS', 'Nama Siswa', 'Kelas', 'Status', 'Keterangan'];
      const csvRows = records.map((r) => [
        format(new Date(r.date), 'dd/MM/yyyy'),
        r.student.nis,
        r.student.name,
        r.class.name,
        r.status,
        r.note || '',
      ]);

      const csv = [
        csvHeaders.join(','),
        ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="laporan-absensi-${startDate}-${endDate}.csv"`,
        },
      });
    } else {
      // Generate PDF
      const doc = new jsPDF();

      // Title
      doc.setFontSize(18);
      doc.text('Laporan Absensi', 14, 20);

      // Info
      doc.setFontSize(11);
      doc.text(`Periode: ${format(new Date(startDate), 'dd/MM/yyyy')} - ${format(new Date(endDate), 'dd/MM/yyyy')}`, 14, 30);
      doc.text(`Total Record: ${records.length}`, 14, 36);

      // Table
      autoTable(doc, {
        startY: 45,
        head: [['Tanggal', 'NIS', 'Nama Siswa', 'Kelas', 'Status', 'Keterangan']],
        body: records.map((r) => [
          format(new Date(r.date), 'dd/MM/yyyy'),
          r.student.nis,
          r.student.name,
          r.class.name,
          r.status,
          r.note || '-',
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
      });

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="laporan-absensi-${startDate}-${endDate}.pdf"`,
        },
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export report' },
      { status: 500 }
    );
  }
}
