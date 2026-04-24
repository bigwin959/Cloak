"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CreateRuleModal from "./CreateRuleModal";

export default function NewRuleButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-lg flex items-center font-medium transition-colors shadow-lg shadow-brand-500/20"
      >
        <Plus className="w-5 h-5 mr-2" />
        Create New Rule
      </button>
      
      <CreateRuleModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
