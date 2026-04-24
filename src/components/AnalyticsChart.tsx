"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex-1 border border-dashed border-dark-border rounded-xl flex items-center justify-center bg-white/[0.02]">
        <div className="text-center text-gray-500">
          <p>No traffic recorded yet</p>
          <p className="text-xs mt-1">Route some traffic to see live logs.</p>
        </div>
      </div>
    );
  }

  // Define custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 border border-dark-border/50 text-sm">
          <p className="text-gray-400 mb-1">{label}</p>
          <p className="text-brand-400 font-semibold">Hits: {payload[0].value}</p>
          {payload[1] && <p className="text-accent-pink font-semibold">Bots: {payload[1].value}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 w-full h-full min-h-[250px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorHits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBots" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            stroke="#4b5563" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#4b5563" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="hits" 
            stroke="#14b8a6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorHits)" 
          />
          <Area 
            type="monotone" 
            dataKey="bots" 
            stroke="#ec4899" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorBots)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
