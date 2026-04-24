"use client";

import { Play, Pause, Trash2, Globe, Smartphone, MousePointer2 } from "lucide-react";
import { useTransition } from "react";
import { toggleRuleState, deleteRule } from "@/app/actions/rule-actions";
export default function RuleItem({ rule }: { rule: any }) {
  const [isPending, startTransition] = useTransition();

  // Helper to parse conditions for UI
  let parsedCondition = { param: "Unknown", operator: "==", value: "Unknown" };
  try {
    const arr = JSON.parse(rule.conditions);
    if (arr.length > 0) parsedCondition = arr[0];
  } catch (e) {}

  // Helper to parse actions for UI
  let parsedAction = { type: "Unknown", target: "Unknown" };
  try {
    parsedAction = JSON.parse(rule.action);
  } catch (e) {}

  
  const ConditionIcon = parsedCondition.param === "country" 
    ? <Globe className="w-5 h-5 text-blue-400" />
    : parsedCondition.param === "device.type"
      ? <Smartphone className="w-5 h-5 text-purple-400" />
      : <MousePointer2 className="w-5 h-5 text-orange-400" />;

  const iconBg = parsedCondition.param === "country" 
    ? "bg-blue-500/10 border-blue-500/20"
    : parsedCondition.param === "device.type"
      ? "bg-purple-500/10 border-purple-500/20"
      : "bg-orange-500/10 border-orange-500/20";

  return (
    <div className={`p-5 hover:bg-white/[0.02] transition-colors flex items-center justify-between group ${!rule.isActive ? 'opacity-60' : ''} ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex gap-4">
        <div className="mt-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${iconBg}`}>
            {ConditionIcon}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            {rule.name}
            {rule.isActive ? (
              <span className="text-xs bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded border border-brand-500/20">Priority {rule.priority}</span>
            ) : (
              <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded border border-gray-500/20">Paused</span>
            )}
            
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            IF <span className="text-white font-mono bg-white/10 px-1 rounded">{parsedCondition.param} {parsedCondition.operator} "{parsedCondition.value}"</span> 
            {' '}THEN <span className={`font-medium ${parsedAction.type === 'Block' ? 'text-accent-pink' : 'text-accent-teal'}`}>{parsedAction.type} {parsedAction.target && `to ${parsedAction.target}`}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => startTransition(() => { toggleRuleState(rule.id, rule.isActive) })}
          className={`p-2 rounded-lg transition-colors ${rule.isActive ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-brand-500 hover:text-brand-400 hover:bg-white/10'}`} 
          title={rule.isActive ? "Pause Rule" : "Activate Rule"}
        >
          {rule.isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button 
          onClick={() => startTransition(() => { deleteRule(rule.id) })}
          className="p-2 text-gray-500 hover:text-accent-pink hover:bg-white/10 rounded-lg transition-colors"
          title="Delete Rule"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
