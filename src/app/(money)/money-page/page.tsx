export default function MoneyPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          The VIP Offer
        </h1>
        <p className="text-lg text-slate-400">
          Congratulations! You've passed the secure edge routing checks and reached the official verified destination.
        </p>
        <div className="p-8 border border-emerald-500/20 bg-emerald-500/10 rounded-3xl mt-8">
          <p className="text-emerald-300 font-mono text-sm uppercase tracking-widest mb-4">Secured Session Live</p>
          <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-500/25">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
