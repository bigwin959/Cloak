"use client";

import { useState, useEffect } from "react";
import { Cpu, Globe, Cloud, Database, Wifi, Server, Code, Zap, RefreshCw, Trophy } from "lucide-react";

// Pair up the icons
const cardIcons = [
  Cpu, Globe, Cloud, Database, Wifi, Server, Code, Zap,
  Cpu, Globe, Cloud, Database, Wifi, Server, Code, Zap
];

interface CardState {
  id: number;
  Icon: any;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function GamePage() {
  const [cards, setCards] = useState<CardState[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]); // indexes
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const initializeGame = () => {
    // Shuffle
    const shuffled = [...cardIcons]
      .sort(() => Math.random() - 0.5)
      .map((Icon, idx) => ({
        id: idx,
        Icon,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsLocked(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (isLocked) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves((m) => m + 1);

      const [firstIdx, secondIdx] = newFlipped;
      if (newCards[firstIdx].Icon === newCards[secondIdx].Icon) {
        // Match!
        setTimeout(() => {
          setCards((prev) => {
            const matchedCards = [...prev];
            matchedCards[firstIdx].isMatched = true;
            matchedCards[secondIdx].isMatched = true;
            return matchedCards;
          });
          setMatches((m) => m + 1);
          setFlippedCards([]);
          setIsLocked(false);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) => {
            const resetCards = [...prev];
            resetCards[firstIdx].isFlipped = false;
            resetCards[secondIdx].isFlipped = false;
            return resetCards;
          });
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const isGameOver = matches === 8;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight">
              NeuraMatch
            </h1>
            <p className="text-slate-400 mt-1">Connect the core systems.</p>
          </div>
          
          <div className="flex gap-4 sm:gap-6 text-center">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-3 border border-slate-700/50 shadow-xl min-w-[80px]">
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Moves</p>
              <p className="text-xl sm:text-2xl font-bold text-indigo-300">{moves}</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-3 border border-slate-700/50 shadow-xl min-w-[80px]">
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Pairs</p>
              <p className="text-xl sm:text-2xl font-bold text-cyan-300">{matches} / 8</p>
            </div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6 preserve-3d">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className="relative aspect-square w-full perspective-1000 group cursor-pointer"
              aria-label={`Card ${idx}`}
            >
              <div 
                className={`w-full h-full duration-500 preserve-3d relative ${
                  card.isFlipped || card.isMatched ? "rotate-y-180" : ""
                }`}
              >
                {/* Back of card (visible when face down) */}
                <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/20 group-hover:border-indigo-500/50 transition-all duration-300">
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-slate-600/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-indigo-500/40 rounded-full group-hover:bg-indigo-400/60 transition-colors" />
                  </div>
                </div>

                {/* Face of card (visible when flipped) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.3)] border border-indigo-400/50">
                  <card.Icon className={`w-8 h-8 md:w-12 md:h-12 text-white drop-shadow-md transition-all duration-500 ${card.isMatched ? 'scale-110 text-cyan-100' : ''}`} />
                  
                  {/* Subtle success ring overlay if matched */}
                  <div className={`absolute inset-0 rounded-2xl border-2 border-emerald-400/50 shadow-[inset_0_0_20px_rgba(52,211,153,0.3)] duration-500 transition-opacity ${card.isMatched ? 'opacity-100' : 'opacity-0'}`}></div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Win State Overlay */}
        {isGameOver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-slate-700/50 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <Trophy className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Systems Online</h2>
              <p className="text-slate-400 mb-8">
                You successfully matched all core connections in <span className="font-semibold text-indigo-400">{moves} moves</span>.
              </p>
              <button 
                onClick={initializeGame}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
              >
                <RefreshCw className="w-5 h-5" />
                Initialize New Sequence
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
