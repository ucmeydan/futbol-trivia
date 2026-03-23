'use client';

import { useState, useEffect, useRef } from 'react';
import playersData from '../data/players.json';

const SQUAD_QUESTIONS = [
  {
    id: 1,
    title: "Beşiktaş forması giymiş Fransız futbolcular?",
    targets: ["Pascal Nouma", "Edouard Cisse", "Julien Escude", "Valentin Rosier", "Arthur Masuaku", "Georges-Kevin N'Koudou", "Nicolas Isimat-Mirin", "Jean Onana"],
    difficulty: "Orta"
  },
  {
    id: 2,
    title: "Türkiye'nin 2002 Dünya Kupası kadrosundaki kaleciler?",
    targets: ["Rüştü Reçber", "Ömer Çatkıç", "Zafer Özgültekin"],
    difficulty: "Kolay"
  }
];

export default function SquadGame() {
  const [currentQ, setCurrentQ] = useState(SQUAD_QUESTIONS[0]);
  const [query, setQuery] = useState('');
  const [foundPlayers, setFoundPlayers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isActive, setIsActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [bonusAnim, setBonusAnim] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sayaç Mantığı
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Arama Önerileri
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
    if (!isActive) setIsActive(true);

    const normGuess = guess.trim().toLowerCase();
    const isCorrect = currentQ.targets.some(t => t.toLowerCase() === normGuess);
    const isAlreadyFound = foundPlayers.some(f => f.toLowerCase() === normGuess);

    if (isCorrect && !isAlreadyFound) {
      const actualName = currentQ.targets.find(t => t.toLowerCase() === normGuess)!;
      setFoundPlayers(prev => [...prev, actualName]);
      setQuery('');
      setSuggestions([]);
      
      // +5 Saniye Bonusu
      setTimeLeft(prev => prev + 5);
      setBonusAnim(true);
      setTimeout(() => setBonusAnim(false), 1000);

      // Hepsi bulundu mu?
      if (foundPlayers.length + 1 === currentQ.targets.length) {
        setIsGameOver(true);
        setIsActive(false);
      }
    } else {
      setQuery('');
    }
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-4 text-white bg-slate-950 font-sans">
      
      {/* Üst Bilgi Paneli */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <div className={`text-4xl font-bebas tracking-widest ${timeLeft < 20 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          {bonusAnim && (
            <div className="absolute -top-4 -right-8 text-green-500 font-bebas text-xl animate-bounce">
              +5s
            </div>
          )}
        </div>
        <div className="text-right font-bebas">
          <div className="text-slate-500 text-xs tracking-widest uppercase italic">İLERLEME</div>
          <div className="text-2xl">{foundPlayers.length} / {currentQ.targets.length}</div>
        </div>
      </div>

      {/* Soru */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 mb-6 shadow-xl">
        <h2 className="text-xl font-bold text-center leading-tight">
          {currentQ.title}
        </h2>
      </div>

      {/* Cevap Listesi */}
      <div className="flex-grow overflow-y-auto space-y-2 mb-6 pr-1 custom-scrollbar">
        {foundPlayers.map((player, i) => (
          <div key={i} className="bg-green-600/20 border border-green-500/50 p-3 rounded-xl flex justify-between items-center animate-in slide-in-from-left duration-300">
            <span className="font-bebas tracking-wide text-sm">{player}</span>
            <span className="text-green-500 text-xs">✓</span>
          </div>
        ))}
        {Array.from({ length: currentQ.targets.length - foundPlayers.length }).map((_, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl text-slate-700 italic text-sm text-center">
            ? ? ? ? ?
          </div>
        ))}
      </div>

      {/* Input Alanı */}
      <div className="mt-auto">
        {!isGameOver ? (
          <div className="relative">
            {suggestions.length > 0 && (
              <div className="absolute bottom-full w-full mb-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-50 shadow-2xl">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleGuess(s)}
                    className="w-full p-4 text-left border-b border-slate-700 last:border-0 hover:bg-red-600 transition-colors font-bebas tracking-widest"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="FUTBOLCU İSMİ YAZIN..."
              className="w-full p-5 bg-slate-900 rounded-2xl border-2 border-slate-800 focus:border-red-600 outline-none font-bebas tracking-widest text-lg transition-all"
            />
          </div>
        ) : (
          <div className="bg-slate-900 p-6 rounded-2xl border-2 border-red-600 text-center animate-in zoom-in duration-300">
            <h3 className="font-bebas text-3xl mb-2 italic">SÜRE BİTTİ!</h3>
            <p className="text-slate-400 mb-4 text-sm uppercase tracking-widest font-bold">Toplam {foundPlayers.length} doğru cevap verdin.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-xl font-bebas text-xl tracking-widest transition-all"
            >
              YENİDEN DENE
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
}