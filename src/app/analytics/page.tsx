import { prisma } from "@/lib/prisma";
import { ShieldCheck, Globe, Smartphone, Monitor } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AnalyticsFeedPage() {
  const logs = await prisma.log.findMany({
    take: 200, // Load the latest 200 logs
    orderBy: { timestamp: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Traffic Analytics Feed</h1>
          <p className="text-gray-400 mt-1">Raw telemetry data sourced directly from the Edge proxy layer.</p>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-bg/80 border-b border-dark-border text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">IP Hash (Anonymized)</th>
                <th className="px-6 py-4 font-medium">Country</th>
                <th className="px-6 py-4 font-medium">Device</th>
                <th className="px-6 py-4 font-medium">Route / Action Taken</th>
                <th className="px-6 py-4 font-medium">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border bg-dark-surface/40">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No telemetry data found.
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                      {log.ipHash}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm">
                        <Globe className="w-4 h-4 mr-2 text-gray-500" />
                        {log.country || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-400 capitalize">
                        {log.device === 'mobile' ? <Smartphone className="w-4 h-4 mr-2" /> : <Monitor className="w-4 h-4 mr-2" />}
                        {log.device}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className="bg-dark-bg px-2 py-1 rounded text-brand-400 border border-dark-border">
                        {log.routeTaken}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.isBot ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-pink/10 text-accent-pink border border-accent-pink/20">
                          <ShieldCheck className="w-3.5 h-3.5" /> Bot Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-teal/10 text-accent-teal border border-accent-teal/20">
                          Human
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
