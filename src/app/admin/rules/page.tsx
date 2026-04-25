import { ListFilter } from "lucide-react";
import NewRuleButton from "@/components/NewRuleButton";
import RuleItem from "@/components/RuleItem";
import { prisma } from "@/lib/prisma";

// Next.js config to ensure fresh data if needed, or rely on revalidatePath
export const dynamic = 'force-dynamic';

export default async function RulesPage() {
  const rules = await prisma.rule.findMany({
    orderBy: { priority: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Routing Rules</h1>
          <p className="text-gray-400 mt-1">Manage edge routing, redirects, and traffic splitting conditions.</p>
        </div>
        <NewRuleButton />
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-dark-border flex bg-dark-bg/50">
          <div className="relative w-full max-w-sm">
            <ListFilter className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Filter rules..." 
              className="w-full bg-dark-surface border border-dark-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        <div className="divide-y divide-dark-border">
          {rules.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No rules configured. Click "Create New Rule" to get started.
            </div>
          ) : (
            rules.map((rule: any) => (
              <RuleItem key={rule.id} rule={rule} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
