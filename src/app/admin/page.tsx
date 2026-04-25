import { Activity, Globe, Smartphone, ShieldCheck, ArrowUpRight } from "lucide-react";
import AnalyticsChart from "@/components/AnalyticsChart";
import { prisma } from "@/lib/prisma";

// Force dynamic fetch to query DB frequently
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardOverview() {
  // Fetch real telemetry metrics
  const totalRequests = await prisma.log.count();
  const botBlocks = await prisma.log.count({ where: { isBot: true } });
  
  // Calculate distinct countries roughly (Prisma SQLite doesn't support distinct counts natively well without grouping)
  const countriesData = await prisma.log.groupBy({
    by: ['country'],
  });
  const totalCountries = countriesData.filter((c: any) => c.country !== 'Unknown').length;

  const mobileRequests = await prisma.log.count({ where: { device: 'mobile' } });
  const mobilePercentage = totalRequests > 0 ? Math.round((mobileRequests / totalRequests) * 100) : 0;

  // Process recent logs for the chart (Grouped by simple logical increments, mocked via looping the recent 100 logs for MVP)
  const recentLogs = await prisma.log.findMany({
    take: 100,
    orderBy: { timestamp: 'asc' }
  });

  // Group logs by hour/minute string for chart mapping
  const chartMap = new Map();
  recentLogs.forEach((log: any) => {
    const timeKey = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (!chartMap.has(timeKey)) {
      chartMap.set(timeKey, { time: timeKey, hits: 0, bots: 0 });
    }
    const bucket = chartMap.get(timeKey);
    bucket.hits += 1;
    if (log.isBot) bucket.bots += 1;
  });
  const chartData = Array.from(chartMap.values());

  // Top executed rules roughly mapped by "routeTaken"
  const rulesData = await prisma.log.groupBy({
    by: ['routeTaken'],
    _count: true,
    orderBy: { _count: { routeTaken: 'desc' } },
    take: 3
  });

  // Recent 3 logs for feed
  const feedLogs = await prisma.log.findMany({
    take: 4,
    orderBy: { timestamp: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Traffic Overview</h1>
        <p className="text-gray-400">Real-time routing analytics and edge performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Requests" 
          value={totalRequests.toLocaleString()} 
          change="live" 
          icon={<Activity className="w-5 h-5 text-brand-400" />} 
        />
        <KPICard 
          title="Distinct Countries" 
          value={totalCountries.toString()} 
          change="active" 
          icon={<Globe className="w-5 h-5 text-accent-teal" />} 
        />
        <KPICard 
          title="Bot Traffic Blocked" 
          value={botBlocks.toLocaleString()} 
          change="filtered" 
          icon={<ShieldCheck className="w-5 h-5 text-accent-pink" />} 
        />
        <KPICard 
          title="Mobile Routing" 
          value={`${mobilePercentage}%`} 
          change="share" 
          icon={<Smartphone className="w-5 h-5 text-purple-400" />} 
        />
      </div>

      {/* Analytics Chart Area */}
      <div className="glass-panel p-6 h-96 flex flex-col">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          Live Traffic Flow
          <span className="ml-2 flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal"></span>
          </span>
        </h3>
        
        <AnalyticsChart data={chartData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-4">Top Executed Routes</h3>
          <ul className="space-y-4">
            {rulesData.length === 0 && <p className="text-sm text-gray-400">No routing execution data available.</p>}
            {rulesData.map((data: any, i: number) => (
              <li key={i} className="flex items-center justify-between p-3 rounded-lg bg-dark-bg/50 border border-dark-border">
                <span className="text-sm font-medium font-mono truncate">{data.routeTaken}</span>
                <span className="text-xs bg-brand-500/20 text-brand-400 px-2 py-1 rounded-md">{data._count} hits</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Edge Logs</h3>
          <div className="space-y-3">
             {feedLogs.length === 0 && <p className="text-sm text-gray-400">Awaiting edge logs.</p>}
             {feedLogs.map((log: any) => (
               <LogItem 
                 key={log.id} 
                 ip={log.ipHash.substring(0, 8) + '...'} 
                 country={log.country || 'XX'} 
                 action={log.routeTaken} 
                 isBot={log.isBot}
                 time={new Date(log.timestamp).toLocaleTimeString()} 
               />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <div className="p-2 rounded-lg bg-white/5">{icon}</div>
      </div>
      <div className="flex items-end gap-3">
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-sm font-medium mb-1 text-gray-500">
          {change} 
        </div>
      </div>
    </div>
  );
}

function LogItem({ ip, country, action, time, isBot }: { ip: string, country: string, action: string, time: string, isBot: boolean }) {
  return (
    <div className="flex justify-between text-sm py-2 border-b border-dark-border/50 last:border-0 group">
      <div className="flex items-center gap-3">
        <div className={`w-8 flex justify-center text-xs font-mono py-1 rounded ${isBot ? 'bg-accent-pink/20 text-accent-pink' : 'bg-dark-bg'}`}>
          {country}
        </div>
        <span className="font-mono text-gray-400">{ip}</span>
      </div>
      <div className="flex items-center gap-4 text-gray-500">
        <span className="text-brand-400 font-medium truncate max-w-[120px]">{action}</span>
        <span className="text-xs">{time}</span>
      </div>
    </div>
  );
}
