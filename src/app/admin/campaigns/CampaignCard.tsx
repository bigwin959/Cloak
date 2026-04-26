'use client';

import { useState, useEffect } from 'react';
import { Activity, AlertCircle } from 'lucide-react';

export default function CampaignCard({ camp, deleteAction }: { camp: any, deleteAction: (formData: FormData) => void }) {
  const [moneyStatus, setMoneyStatus] = useState<string>('checking');
  const [cloakStatus, setCloakStatus] = useState<string>('checking');

  useEffect(() => {
    // Ping Money URL
    fetch('/api/checker', {
      method: 'POST',
      body: JSON.stringify({ url: camp.moneyUrl }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(r => r.json())
    .then(data => setMoneyStatus(data.status))
    .catch(() => setMoneyStatus('offline'));

    // Ping Cloak URL
    fetch('/api/checker', {
      method: 'POST',
      body: JSON.stringify({ url: camp.cloakUrl }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(r => r.json())
    .then(data => setCloakStatus(data.status))
    .catch(() => setCloakStatus('offline'));
  }, [camp.moneyUrl, camp.cloakUrl]);

  return (
    <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group transition-all hover:bg-slate-800/80 hover:border-slate-600">
      <div className="w-full">
        <div className="flex items-center justify-between w-full mb-1">
            <div className="flex items-center gap-3">
            <h4 className="font-semibold text-emerald-400">{camp.name}</h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
            </span>
            </div>
            
            <form action={deleteAction}>
                <input type="hidden" name="id" value={camp.id} />
                <button type="submit" className="px-3 py-2 text-xs font-semibold text-rose-400 bg-rose-400/10 hover:bg-rose-400/20 border border-rose-400/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                Archieve
                </button>
            </form>
        </div>
        
        <p className="text-sm font-mono text-slate-300 mb-3 bg-slate-900 inline-block px-2 py-1 rounded border border-slate-700/50">
            /go/{camp.slug}
        </p>

        <div className="flex flex-col gap-2 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">M</span> 
            <span className="truncate max-w-xs">{camp.moneyUrl}</span>
            {moneyStatus === 'checking' && <span className="text-slate-500 flex items-center gap-1 ml-auto"><Activity className="w-3 h-3 animate-pulse"/> checking</span>}
            {moneyStatus === 'online' && <span className="text-emerald-400 font-semibold px-2 border border-emerald-400/20 bg-emerald-400/10 rounded ml-auto">LIVE</span>}
            {moneyStatus === 'offline' && <span className="text-rose-400 flex items-center gap-1 font-semibold px-2 border border-rose-400/20 bg-rose-400/10 rounded ml-auto"><AlertCircle className="w-3 h-3"/> OFFLINE</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded">C</span> 
            <span className="truncate max-w-xs">{camp.cloakUrl}</span>
            {cloakStatus === 'checking' && <span className="text-slate-500 flex items-center gap-1 ml-auto"><Activity className="w-3 h-3 animate-pulse"/> checking</span>}
            {cloakStatus === 'online' && <span className="text-emerald-400 font-semibold px-2 border border-emerald-400/20 bg-emerald-400/10 rounded ml-auto">LIVE</span>}
            {cloakStatus === 'offline' && <span className="text-rose-400 flex items-center gap-1 font-semibold px-2 border border-rose-400/20 bg-rose-400/10 rounded ml-auto"><AlertCircle className="w-3 h-3"/> OFFLINE</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
