'use client';

import { useQuery } from '@tanstack/react-query';
import { formatTime, getAttendanceStatusColor, getAttendanceStatusLabel } from '@/lib/utils';

export function RecentAttendance() {
  const { data: recentData } = useQuery({
    queryKey: ['recent-attendance'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/recent');
      if (!res.ok) throw new Error('Failed to fetch recent attendance');
      return res.json();
    },
  });

  if (!recentData || recentData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Belum ada data absensi</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentData.map((item: any) => (
        <div key={item.id} className="flex items-center">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{item.student.name}</p>
            <p className="text-sm text-muted-foreground">
              {item.class.name} • {formatTime(item.recordedAt)}
            </p>
          </div>
          <div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getAttendanceStatusColor(
                item.status
              )}`}
            >
              {getAttendanceStatusLabel(item.status)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
