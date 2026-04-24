"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { createRule } from "@/app/actions/rule-actions";

export default function CreateRuleModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createRule(formData);
      if (result.success) {
        onClose();
      } else {
        alert("Failed to create rule");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-dark-surface border border-dark-border shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-dark-border">
          <h2 className="text-xl font-bold">Create New Routing Rule</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form action={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Rule Name</label>
              <input name="name" required placeholder="e.g. Mobile Traffic Redirect" className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Priority (Higher runs first)</label>
              <input name="priority" type="number" defaultValue={10} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors" />
            </div>

            <div className="border border-dark-border rounded-xl p-4 bg-dark-bg/50">
              <h3 className="text-sm font-semibold mb-3">IF Condition</h3>
              <div className="grid grid-cols-3 gap-2">
                <select name="conditionParam" className="col-span-1 bg-dark-surface border border-dark-border rounded-lg px-2 py-2 text-sm focus:outline-none">
                  <option value="country">Country</option>
                  <option value="device.type">Device Type</option>
                  <option value="ip">IP Address</option>
                </select>
                <select name="conditionOperator" className="col-span-1 bg-dark-surface border border-dark-border rounded-lg px-2 py-2 text-sm focus:outline-none">
                  <option value="==">Equals (==)</option>
                  <option value="!=">Not Equals (!=)</option>
                  <option value="contains">Contains</option>
                </select>
                <input name="conditionValue" required placeholder="e.g. US" className="col-span-1 bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none" />
              </div>
            </div>

            <div className="border border-dark-border rounded-xl p-4 bg-dark-bg/50">
              <h3 className="text-sm font-semibold mb-3">THEN Action</h3>
              <div className="grid grid-cols-2 gap-2">
                <select name="actionType" className="bg-dark-surface border border-dark-border rounded-lg px-2 py-2 text-sm focus:outline-none">
                  <option value="Rewrite">Rewrite To</option>
                  <option value="Redirect">Redirect To</option>
                  <option value="Block">Block Connection</option>
                </select>
                <input name="actionTarget" placeholder="e.g. /mobile-lp" className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-brand-500/20">
              {isPending ? "Creating..." : "Create Rule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
