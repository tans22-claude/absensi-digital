'use client';

import { useQuery } from '@tanstack/react-query';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export function AttendanceChart() {
  const { data: chartData } = useQuery({
    queryKey: ['attendance-chart'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/chart');
      if (!res.ok) throw new Error('Failed to fetch chart data');
      return res.json();
    },
  });

  if (!chartData) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="present"
          stroke="#10b981"
          strokeWidth={2}
          name="Hadir"
        />
        <Line
          type="monotone"
          dataKey="absent"
          stroke="#ef4444"
          strokeWidth={2}
          name="Tidak Hadir"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
