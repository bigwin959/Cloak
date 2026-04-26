import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Link from 'next/link';
import { Activity, Route, Home, ShieldAlert, BarChart3, Settings } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ITRS - Intelligent Traffic Routing System",
  description: "Advanced Edge Routing and Traffic Optimization Dashboard",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`min-h-screen flex w-full bg-[#0f1115] text-[#f8fafc]`}>
        
        {/* Sidebar */}
        <aside className="w-64 border-r border-dark-border bg-dark-surface/50 backdrop-blur flex flex-col justify-between hidden md:flex">
          <div>
            <div className="h-16 flex items-center px-6 border-b border-dark-border">
              <Activity className="w-6 h-6 text-brand-500 mr-2" />
              <span className="text-lg font-bold text-gradient tracking-wide">ITRS Platform</span>
            </div>
            
            <nav className="p-4 space-y-2 mt-4">
              <Link href="/admin" className="flex items-center px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
                <Home className="w-4 h-4 mr-3 text-brand-400" />
                Dashboard Overview
              </Link>
              <Link href="/admin/campaigns" className="flex items-center px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
                <Route className="w-4 h-4 mr-3 text-emerald-400" />
                Campaign Sets
              </Link>
              <Link href="/admin/rules" className="flex items-center px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
                <Route className="w-4 h-4 mr-3 text-brand-400" />
                Routing Rules
              </Link>
              <Link href="/admin/analytics" className="flex items-center px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
                <BarChart3 className="w-4 h-4 mr-3 text-brand-400" />
                Traffic Analytics
              </Link>
              <Link href="/admin/security" className="flex items-center px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
                <ShieldAlert className="w-4 h-4 mr-3 text-brand-400" />
                Bot Filtering
              </Link>
            </nav>
          </div>
          
          <div className="p-4 border-t border-dark-border">
            <Link href="/admin/settings" className="flex items-center px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium text-gray-400">
              <Settings className="w-4 h-4 mr-3" />
              System Settings
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-dark-border flex items-center justify-end px-8 bg-dark-surface/30 backdrop-blur sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-brand-500/20 border border-brand-500/50 flex items-center justify-center">
                <span className="text-xs font-bold text-brand-400">A</span>
              </div>
            </div>
          </header>
          
          <div className="p-8 flex-1 overflow-y-auto">
            {children}
          </div>
        </main>
    </div>
  );
}
