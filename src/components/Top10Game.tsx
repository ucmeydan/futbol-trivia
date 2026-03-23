'use client';

import { useState, useEffect, useRef } from 'react';
import playersData from '../data/players.json';

const QUESTIONS = [
  {
    title: "Galatasaray tarihinde en çok maça çıkan 10 yabancı oyuncu?",
    targets: ["Fernando Muslera", "Faryd Mondragon", "Cevad Prekazi", "Zoran Simovic", "Gheorghe Hagi", "Gheorghe Popescu", "Wesley Sneijder", "Lucas Torreira", "Sofiane Feghouli", "Ryan Donk"]
  },
  {
    title: "Süper Lig tarihinin en golcü 10 Brezilyalı oyuncusu?",
    targets: ["Alex De Souza", "Marcio Nobre", "Bobo", "Tita", "Fernandao", "Jaba", "Anderson Talisca", "Vagner Love", "Wederson", "Doka Madureira"]
  }
];

const formatPlayerName = (name: string) => {
  return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function Top10Game() {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(QUESTIONS[0]);
  const [query, setQuery] = useState('');
  const [foundIndices, setFoundIndices] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [lives, setLives] = useState(3);
  const [isError, setIsError] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Başlangıçta bugünün sorusunu bul
  useEffect(() => {
    const today = new Date();
    const startDate = new Date("2026-03-09"); // Sitenin başlangıç tarihi
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const initialIdx = Math.min(diffDays, QUESTIONS.length - 1);
    
    setQuestionIdx(initialIdx);
    loadGameProgress(initialIdx);

    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      if (diff <= 1000) window.location.reload();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadGameProgress = (idx: number) => {
    const activeQ = QUESTIONS[idx];
    setCurrentQuestion(activeQ);
    const saved = localStorage.getItem(`tr_trivia_q${idx}`);
    if (saved) {
      const { indices, state, remLives } = JSON.parse(saved);
      setFoundIndices(indices);
      setGameState(state);
      setLives(remLives);
    } else {
      setFoundIndices([]);
      setGameState('playing');
      setLives(3);
    }
  };

  useEffect(() => {
    const data = { indices: foundIndices, state: gameState, remLives: lives };
    localStorage.setItem(`tr_trivia_q${questionIdx}`, JSON.stringify(data));
  }, [foundIndices, gameState, lives, questionIdx]);

  useEffect(() => {
    if (query.length >= 3) {
      const unique = Array.from(new Set(playersData as string[]));
      const filtered = unique
        .filter(p => p.toLowerCase().includes(query.toLowerCase()))
        .filter(p => !foundIndices.some(idx => currentQuestion.targets[idx].toLowerCase() === p.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
    }
  }, [query, foundIndices, currentQuestion]);

  const handleGuess = (guess: string) => {
    if (gameState !== 'playing') return;
    const norm = guess.trim().toLowerCase();
    const idx = currentQuestion.targets.findIndex(n => n.toLowerCase() === norm);

    if (idx !== -1 && !foundIndices.includes(idx)) {
      const newIndices = [...foundIndices, idx];
      setFoundIndices(newIndices);
      setQuery('');
      if (newIndices.length === currentQuestion.targets.length) setGameState('won');
    } else {
      setIsError(true);
      setLives(p => p - 1);
      setTimeout(() => setIsError(false), 500);
      if (lives - 1 <= 0) setGameState('lost');
      setQuery('');
    }
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const changeQuestion = (dir: number) => {
    const newIdx = questionIdx + dir;
    if (newIdx >= 0 && newIdx < QUESTIONS.length) {
      setQuestionIdx(newIdx);
      loadGameProgress(newIdx);
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col justify-between p-4 text-white overflow-hidden">
      {/* ÜST NAVİGASYON PANELİ */}
      <div className="text-center pt-2">
        <div className="flex justify-between items-center px-6 mb-2">
          <button onClick={() => changeQuestion(-1)} disabled={questionIdx === 0} className="text-[10px] font-bebas tracking-widest opacity-50 disabled:opacity-5 hover:opacity-100 transition-all">{"< ÖNCEKİ"}</button>
          <span className="font-bebas text-sm text-red-600 tracking-tighter">#{questionIdx + 1}</span>
          <button onClick={() => changeQuestion(1)} disabled={questionIdx === QUESTIONS.length - 1} className="text-[10px] font-bebas tracking-widest opacity-50 disabled:opacity-5 hover:opacity-100 transition-all">{"SONRAKİ >"}</button>
        </div>
        <p className="text-white text-base font-bold leading-tight px-4">{currentQuestion.title}</p>
      </div>

      <div className="flex justify-between items-center my-2 px-2 font-bebas">
        <div className="bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          <span className="text-slate-500 mr-2 uppercase text-[10px]">SKOR:</span>
          <span className="text-lg tracking-widest">{foundIndices.length}/{currentQuestion.targets.length}</span>
        </div>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <span key={i} className={`text-xl transition-all duration-300 ${i < lives ? "grayscale-0 opacity-100" : "grayscale opacity-20 scale-75"}`}>❤️</span>
          ))}
        </div>
      </div>

      <div className="flex-grow space-y-1.5 px-1 overflow-y-auto">
        {currentQuestion.targets.map((name, i) => (
          <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-500 ${foundIndices.includes(i) ? "correct-reveal border-green-500 font-bebas tracking-widest" : "bg-slate-950 border-slate-900"}`}>
            <span className={`font-bebas text-sm w-4 ${foundIndices.includes(i) ? "text-red-500" : "text-slate-800"}`}>{i + 1}.</span>
            <span className={`font-bold text-xs tracking-wide ${foundIndices.includes(i) ? "text-white" : "text-slate-800"}`}>
              {foundIndices.includes(i) ? formatPlayerName(name) : "••••••••••••••••"}
            </span>
            {foundIndices.includes(i) && <span className="ml-auto text-green-500 text-[10px] font-bold">✓</span>}
          </div>
        ))}
      </div>

      <div className="mt-4 mb-2">
        {gameState === 'playing' ? (
          <div className="relative">
            {suggestions.length > 0 && (
              <div className="absolute bottom-full w-full mb-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-50 shadow-2xl">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => handleGuess(s)} className={`w-full p-3 text-left border-b border-slate-700 last:border-0 font-bebas tracking-widest transition-colors text-white text-sm ${selectedIndex === i ? "bg-red-600" : "hover:bg-red-600"}`}>{formatPlayerName(s)}</button>
                ))}
              </div>
            )}
            <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="FUTBOLCU ARA..." autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck="false" className={`w-full p-4 bg-slate-950 rounded-xl border-2 transition-all outline-none text-white font-bebas tracking-widest text-base ${isError ? "border-red-600 animate-shake" : "border-slate-800 focus:border-red-600"}`} style={isError ? { animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' } : {}} />
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-900 border-2 border-slate-800 shadow-2xl text-center animate-in fade-in zoom-in duration-500">
              <h3 className="font-bebas text-2xl mb-1 uppercase tracking-tighter text-white">{gameState === 'won' ? "MÜKEMMEL! 🏆" : "OYUN BİTTİ 🏁"}</h3>
              <div className="bg-slate-950 rounded-lg py-2 mb-3">
                <div className="text-3xl font-bebas text-white leading-none">{foundIndices.length} / {currentQuestion.targets.length}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { const sq = currentQuestion.targets.map((_, i) => foundIndices.includes(i) ? "🟩" : "⬜").join(""); const txt = `TR-TRIVIA #${questionIdx + 1}\nSkor: ${foundIndices.length}/${currentQuestion.targets.length}\n${sq}\n\ntr-trivia.com`; if (navigator.share) navigator.share({ title: 'TR-TRIVIA', text: txt }); else { navigator.clipboard.writeText(txt); alert("Kopyalandı!"); } }} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bebas text-base tracking-wider transition-all active:scale-95 shadow-lg shadow-red-900/20">PAYLAŞ 📤</button>
                <div className="flex-1 border-l border-slate-800 pl-2 text-left">
                  <p className="text-slate-500 text-[8px] font-black tracking-widest uppercase italic">YENİ SORU</p>
                  <div className="font-bebas text-xl text-red-500 tracking-widest tabular-nums">{timeLeft}</div>
                </div>
              </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
      `}</style>
    </div>
  );
}