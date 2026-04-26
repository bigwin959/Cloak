import { ShieldCheck, ShieldAlert, Cpu } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Bot Filtering & Security</h1>
        <p className="text-gray-400">Configure edge protection and traffic validation strategies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 border border-slate-800 bg-slate-900/50 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-6 h-6 text-brand-400" />
            <h3 className="text-xl font-semibold">User-Agent Scanning</h3>
          </div>
          <p className="text-sm text-slate-400 mb-6">
            The ITRS Edge Proxy is currently utilizing the generic `isbot` heuristic engine to actively block confirmed data center, cloud, and crawler signatures.
          </p>
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-between">
            <span className="text-emerald-400 font-medium text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Scanning Active
            </span>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input type="checkbox" name="toggle" id="toggle" checked readOnly className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-not-allowed right-0 border-emerald-500" />
              <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-emerald-500 cursor-not-allowed"></label>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 border border-slate-800 bg-slate-900/50 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <h3 className="text-xl font-semibold">Enforced Tracking Parameters</h3>
          </div>
          <p className="text-sm text-slate-400 mb-6">
            Even if traffic passes the bot check, it must contain one of these query parameters to be considered valid human traffic.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded text-sm text-slate-300 font-mono">?clid=</span>
            <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded text-sm text-slate-300 font-mono">?ad_id=</span>
            <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded text-sm text-slate-300 font-mono">?utm_source=</span>
          </div>

          <div className="mt-8 text-xs text-slate-500">
            * Note: To modify these parameters or add custom ones, you must currently edit `src/proxy.ts` directly.
          </div>
        </div>
      </div>
    </div>
  );
}
