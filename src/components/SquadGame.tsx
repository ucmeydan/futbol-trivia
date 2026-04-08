'use client';

import { useState, useEffect, useRef } from 'react';
import playersData from '@/data/players.json';
import Link from 'next/link';

const SQUAD_QUESTIONS = [
  {
    id: 1,
    title: "Beşiktaş forması giymiş Fransız futbolcular?",
    targets: ["Pascal Nouma", "Edouard Cisse", "Julien Escude", "Valentin Rosier", "Arthur Masuaku", "Georges-Kevin N'Koudou", "Nicolas Isimat-Mirin", "Jean Onana"],
  }
];

export default function SquadPage() {
  const [currentQ] = useState(SQUAD_QUESTIONS[0]);
  const [query, setQuery] = useState('');
  const [foundPlayers, setFoundPlayers] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isActive, setIsActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [bonusAnim, setBonusAnim] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (query.length >= 3) {
      const filtered = (playersData as string[])
        .filter(p => p.toLowerCase().includes(query.toLowerCase()))
        .filter(p => !foundPlayers.includes(p))
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query, foundPlayers]);

  const handleGuess = (guess: string) => {
    if (!isActive && !isGameOver) setIsActive(true);
    const norm = guess.trim().toLowerCase();
    const isCorrect = currentQ.targets.some(t => t.toLowerCase() === norm);
    const isAlreadyFound = foundPlayers.some(f => f.toLowerCase() === norm);

    if (isCorrect && !isAlreadyFound) {
      const actualName = currentQ.targets.find(t => t.toLowerCase() === norm)!;
      setFoundPlayers(prev => [actualName, ...prev]);
      setTimeLeft(prev => prev + 5);
      setBonusAnim(true);
      setTimeout(() => setBonusAnim(false), 1000);
      if (foundPlayers.length + 1 === currentQ.targets.length) {
        setIsGameOver(true);
        setIsActive(false);
      }
    } else if (!isCorrect) {
      setWrongGuesses(prev => [guess, ...prev].slice(0, 3));
      setTimeout(() => setWrongGuesses(prev => prev.filter(g => g !== guess)), 2000);
    }
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const progressWidth = (foundPlayers.length / currentQ.targets.length) * 100;

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col p-4 text-white bg-slate-950 overflow-hidden font-sans">
      <Link href="/" className="text-slate-500 font-bebas text-xs mb-4 hover:text-white transition-colors">← MENÜYE DÖN</Link>
      
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold leading-tight mb-4">{currentQ.title}</h2>
        
        <div className="flex justify-between items-end mb-2 px-1">
          <span className="font-bebas text-sm text-slate-400">Doğru Cevaplar: {foundPlayers.length}/{currentQ.targets.length}</span>
          <div className="relative">
            <span className={`font-bebas text-3xl ${timeLeft < 20 ? 'text-red-600 animate-pulse' : 'text-white'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
            {bonusAnim && <span className="absolute -top-4 -right-6 text-green-500 font-bebas animate-bounce">+5s</span>}
          </div>
        </div>

        <div className="w-full h-3 bg-slate-900 rounded-full border border-slate-800 overflow-hidden">
          <div className="h-full bg-green-500 transition-all duration-500 ease-out" style={{ width: `${progressWidth}%` }} />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto mb-4 space-y-2 px-1 custom-scrollbar">
        {wrongGuesses.map((w, i) => (
          <div key={`w-${i}`} className="bg-red-600/20 border border-red-500/50 p-3 rounded-xl flex justify-between items-center animate-shake">
            <span className="text-sm font-bold text-red-500 uppercase">{w}</span>
            <span className="text-red-500 text-xs font-black">❌</span>
          </div>
        ))}
        {foundPlayers.map((p, i) => (
          <div key={`f-${i}`} className="bg-green-600/10 border border-green-500/30 p-3 rounded-xl flex justify-between items-center animate-in slide-in-from-top duration-300">
            <span className="text-sm font-medium text-green-400">{p}</span>
            <span className="text-green-500 text-[10px]">✓</span>
          </div>
        ))}
        {showAll && currentQ.targets.filter(t => !foundPlayers.includes(t)).map((t, i) => (
          <div key={`miss-${i}`} className="bg-slate-800 border border-red-900/50 p-3 rounded-xl flex justify-between items-center">
            <span className="text-sm font-medium text-red-400 opacity-70">{t}</span>
            <span className="text-red-900 text-[10px]">KAÇIRILDI</span>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        {!isGameOver ? (
          <div className="relative">
            {suggestions.length > 0 && (
              <div className="absolute bottom-full w-full mb-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-50 shadow-2xl">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => handleGuess(s)} className="w-full p-4 text-left border-b border-slate-700 last:border-0 hover:bg-red-600 transition-colors font-bebas tracking-widest text-white">{s}</button>
                ))}
              </div>
            )}
            <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="FUTBOLCU ARA..." className="w-full p-5 bg-slate-900 rounded-2xl border-2 border-slate-800 focus:border-red-600 outline-none font-bebas tracking-widest text-lg" />
          </div>
        ) : (
          <div className="space-y-3 p-4 bg-slate-900 rounded-2xl border-2 border-slate-800 animate-in zoom-in duration-300">
            <h3 className="text-center font-bebas text-2xl tracking-widest text-red-600">OYUN TAMAMLANDI</h3>
            <div className="flex gap-2">
              {!showAll && (
                <button onClick={() => setShowAll(true)} className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bebas tracking-widest text-sm">CEVAPLARI GÖSTER</button>
              )}
              <button onClick={() => window.location.reload()} className="flex-1 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-bebas tracking-widest text-sm uppercase">YENİDEN DENE</button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
      `}</style>
    </div>
  );
}