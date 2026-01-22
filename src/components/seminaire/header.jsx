import React from 'react';

export default function Header() {
  return (
    <div className="bg-gradient-to-r from-[#935890] to-[#7d4a79] text-white py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#C9A227] flex items-center justify-center">
            <span className="text-[#935890] font-bold text-lg">G</span>
          </div>
          <div>
            <h1 className="text-lg font-light tracking-wide">Garrigae</h1>
            <p className="text-xs text-[#C9A227] tracking-widest">MANOIR DE BEAUVOIR ★★★</p>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-light mt-6 tracking-wide">
          Procédure & Checklist
        </h2>
        <p className="text-white/70 mt-2 font-light">Salles de séminaire</p>
      </div>
    </div>
  );
}
