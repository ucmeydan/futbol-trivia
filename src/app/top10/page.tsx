'use client';

import { useState, useEffect, useRef } from 'react';
import playersData from '@/data/players.json';
import teamsData from '@/data/teams.json';
import europeanTeamsData from '@/data/european_teams.json';
import allQuestions from '@/data/questions.json';
import Link from 'next/link';
import Confetti from 'react-confetti';

const formatName = (name: string) => {
  return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const normalizeText = (text: string) => {
  if (!text) return "";
  return text
    .trim()
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ı/g, 'i')
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export default function Top10Page() {
  const today = new Date().toISOString().split('T')[0];
  const gameQuestions = allQuestions.filter(q => 
    q.game === "top10" && q.activeDate <= today
  );
  
  const [currentIndex, setCurrentIndex] = useState(gameQuestions.length - 1);
  const currentQ = gameQuestions[currentIndex];

  const [query, setQuery] = useState('');
  const [foundIndices, setFoundIndices] = useState<number[]>([]);
  const [lives, setLives] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showStatsPopup, setShowStatsPopup] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [nextGameTime, setNextGameTime] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showBigX, setShowBigX] = useState(false);
  
  const [stats, setStats] = useState({ 
    totalGames: 0, 
    wins: 0, 
    totalCorrect: 0, 
    distribution: Array(11).fill(0) 
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    const savedStats = localStorage.getItem('top10_stats_v2');
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setNextGameTime(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const shareScore = () => {
    // LINK GÜNCELLENDİ
    const text = `Top 10 #${currentQ.id} skorum: ${foundIndices.length}/${currentQ.targets.length}\nhttps://futbol-trivia.vercel.app/top10`;
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const saveEndGameStats = (finalScore: number, win: boolean) => {
    const newStats = { ...stats };
    newStats.totalGames += 1;
    if (win) newStats.wins += 1;
    newStats.totalCorrect += finalScore;
    newStats.distribution[finalScore] += 1;
    setStats(newStats);
    localStorage.setItem('top10_stats_v2', JSON.stringify(newStats));
  };

  const finishGame = (winStatus: boolean) => {
    setIsGameOver(true);
    setIsActive(false);
    setIsWin(winStatus);
    const finalScore = winStatus ? 10 : foundIndices.length;
    saveEndGameStats(finalScore, winStatus);
    setShowStatsPopup(true);
  };

  const resetGame = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= gameQuestions.length) return;
    setCurrentIndex(newIndex);
    setFoundIndices([]);
    setLives(3);
    setIsActive(false);
    setIsGameOver(false);
    setShowStatsPopup(false);
    setIsWin(false);
    setShowAll(false);
    setQuery('');
  };

  const handleGuess = (guess: string) => {
    if (isGameOver || !currentQ) return;
    const normGuess = normalizeText(guess);
    const idx = currentQ.targets.findIndex(t => normalizeText(t) === normGuess);

    if (idx !== -1 && !foundIndices.includes(idx)) {
      const newFound = [...foundIndices, idx];
      setFoundIndices(newFound);
      if (newFound.length === currentQ.targets.length) finishGame(true);
    } else {
      setIsError(true);
      setShowBigX(true);
      const newLives = lives - 1;
      setLives(newLives);
      setTimeout(() => { setIsError(false); setShowBigX(false); }, 500);
      if (newLives <= 0) finishGame(false);
    }
    setQuery('');
    setSuggestions([]);
  };

  useEffect(() => {
    if (query.length >= 2 && currentQ) {
      let sourceData: string[] = [];
      if (currentQ.type === 'player') sourceData = playersData as string[];
      else if (currentQ.type === 'team' || currentQ.type === 'team-tr') sourceData = teamsData as string[];
      else if (currentQ.type === 'team-eu') sourceData = europeanTeamsData as string[];

      const normalizedQuery = normalizeText(query);
      const filtered = Array.from(new Set(sourceData))
        .filter(item => normalizeText(item).includes(normalizedQuery))
        .filter(item => !foundIndices.some(idx => normalizeText(currentQ.targets[idx]) === normalizeText(item)))
        .slice(0, 5);
      
      setSuggestions(filtered);
      setSelectedIndex(0);
    } else {
      setSuggestions([]);
    }
  }, [query, foundIndices, currentQ]);

  if (!currentQ) return <div className="text-white text-center p-10 font-sans">Bugünün sorusu henüz yayında değil...</div>;

  const maxDist = Math.max(...stats.distribution, 1);
  const correctRate = Math.round((stats.totalCorrect / (stats.totalGames * 10 || 1)) * 100);

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col p-3 text-white bg-slate-950 overflow-hidden font-sans relative">
      {isWin && <Confetti width={windowDimension.width} height={windowDimension.height} recycle={false} numberOfPieces={300} style={{ zIndex: 150 }} />}
      
      {showBigX && (
        <div className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <span className="text-red-600 text-9xl font-bebas animate-pop-out opacity-80 select-none">✕</span>
        </div>
      )}

      <div className="flex justify-between items-start mb-2 relative z-10 font-sans">
        <Link href="/" className="text-slate-500 font-bold text-xs hover:text-white transition-colors pt-1">← Geri Dön</Link>
        <div className="flex flex-col items-end">
          <div className="flex gap-1 mb-1 font-sans">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={`text-base transition-all duration-300 ${i < lives ? "opacity-100" : "opacity-20 grayscale"}`}>❤️</span>
            ))}
          </div>
          {lives === 1 && !isGameOver && <span className="text-[10px] font-bold text-red-500 animate-pulse italic uppercase">SON HAKKIN!</span>}
        </div>
      </div>

      <div className="text-center mb-3 relative z-10 font-sans">
        <div className="flex items-center justify-center gap-4 mb-0.5">
          <button onClick={() => resetGame(currentIndex - 1)} disabled={currentIndex === 0 || isActive} className="text-slate-700 hover:text-red-600 disabled:opacity-0 font-bebas text-xl transition-colors">‹</button>
          <div className="font-bebas text-sm text-red-600 tracking-tighter uppercase">#{currentQ.id}</div>
          <button onClick={() => resetGame(currentIndex + 1)} disabled={currentIndex === gameQuestions.length - 1 || isActive} className="text-slate-700 hover:text-red-600 disabled:opacity-0 font-bebas text-xl transition-colors">›</button>
        </div>
        <h2 className="text-base font-bold leading-tight mb-2 px-2 text-slate-100 tracking-tight">{currentQ.title}</h2>
      </div>

      <div className="flex-grow overflow-y-hidden mb-3 px-1 relative z-10 space-y-1">
        {currentQ.targets.map((name, i) => {
          const isFound = foundIndices.includes(i);
          return (
            <div key={i} className={`flex items-center justify-center h-9 px-4 rounded-xl border transition-all duration-500 ${isFound ? "bg-green-600/10 border-green-500/40" : (showAll ? "bg-red-600/10 border-red-500/40" : "bg-slate-900/40 border-slate-900")}`}>
              {isFound || showAll ? (
                <div className="flex items-center w-full animate-slide-in font-sans">
                  <span className="font-bold text-xs w-5 text-red-600">{i + 1}.</span>
                  <span className="text-xs font-semibold tracking-tight text-white truncate">{formatName(name)}</span>
                  {isFound ? <span className="ml-auto text-green-500 text-[10px]">✓</span> : <span className="ml-auto text-red-500 text-[10px]">✕</span>}
                </div>
              ) : (
                <span className="font-sans font-bold text-white text-lg opacity-80 select-none">{i + 1}</span>
              )}
            </div>
          );
        })}
      </div>

      {showStatsPopup && (
        <div className="absolute inset-0 bg-slate-950/90 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-500 font-sans">
          <div className="w-full bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl relative text-white">
            <button onClick={() => setShowStatsPopup(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">✕</button>
            <h3 className="text-center font-bold text-lg mb-6 italic">İstatistik</h3>
            
            <div className="flex justify-between mb-8 border-b border-slate-800 pb-6 text-center">
              <div className="flex-1">
                <div className="text-2xl font-bold">{stats.totalGames}</div>
                <div className="text-[8px] text-slate-500 font-semibold mt-1 leading-tight uppercase">Oynanan</div>
              </div>
              <div className="flex-1 border-x border-slate-800">
                <div className="text-2xl font-bold text-green-500">{Math.round((stats.wins / (stats.totalGames || 1)) * 100)}%</div>
                <div className="text-[8px] text-slate-500 font-semibold mt-1 leading-tight uppercase">Kazanma</div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-sky-500">{correctRate}%</div>
                <div className="text-[8px] text-slate-500 font-semibold mt-1 leading-tight uppercase">Doğru Oranı</div>
              </div>
            </div>

            <div className="space-y-1.5 mb-8">
              {stats.distribution.map((count, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[10px] font-bold w-2 text-slate-500">{i}</span>
                  <div className="flex-grow bg-slate-950/50 h-5 rounded overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${i === (isWin ? 10 : foundIndices.length) ? 'bg-red-600' : 'bg-slate-700'}`}
                      style={{ width: `${(count / maxDist) * 100 || 5}%` }}
                    >
                      <span className="text-[9px] font-bold px-2 flex items-center h-full text-white">{count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-2xl border border-slate-800 mb-4">
                <div className="text-left font-sans">
                    <p className="text-slate-500 text-[10px] font-semibold uppercase">Sonraki Oyun</p>
                    <p className="font-bold text-lg text-white mt-1 leading-none">{nextGameTime}</p>
                </div>
                {!isWin && !showAll && (
                  <button onClick={() => {setShowAll(true); setShowStatsPopup(false);}} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-semibold transition-colors">Cevapları Göster</button>
                )}
            </div>

            <button onClick={shareScore} className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95">
              {copySuccess ? "KOPYALANDI!" : "Skoru Paylaş"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-auto relative z-10 font-sans">
        {!isGameOver ? (
          <div className="relative font-sans">
            {suggestions.length > 0 && (
              <div className="absolute bottom-full w-full mb-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-50 shadow-2xl">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => handleGuess(s)} className={`w-full p-3.5 text-left border-b border-slate-700 last:border-0 font-semibold text-white text-sm ${selectedIndex === i ? "bg-red-600" : "hover:bg-red-600"}`}>{formatName(s)}</button>
                ))}
              </div>
            )}
            <input 
              ref={inputRef} value={query} 
              onChange={(e) => {setQuery(e.target.value); if (e.target.value.length > 0) setIsActive(true);}}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev)); }
                if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev)); }
                if (e.key === 'Enter' && suggestions[selectedIndex]) handleGuess(suggestions[selectedIndex]);
              }}
              placeholder={currentQ.type.startsWith('team') ? "TAKIM ARA..." : "FUTBOLCU ARA..."} 
              className={`w-full p-4 bg-slate-900 rounded-2xl border-2 border-slate-800 focus:border-red-600 outline-none font-bold text-base ${isError ? "border-red-600 animate-shake" : ""}`} 
            />
          </div>
        ) : (
          <div className="p-4 bg-slate-900 rounded-2xl border-2 border-slate-800 animate-in zoom-in duration-300 relative font-sans">
            <div className="flex items-center justify-between mb-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <div className="text-left font-sans">
                    <p className="text-slate-500 text-[10px] font-semibold uppercase">Sonraki Oyun</p>
                    <p className="font-bold text-lg text-white mt-1 leading-none">{nextGameTime}</p>
                </div>
                <button onClick={() => setShowStatsPopup(true)} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-semibold transition-colors">İstatistik</button>
            </div>
            <button onClick={shareScore} className="w-full bg-white text-black py-3 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all active:scale-95">
              {copySuccess ? "KOPYALANDI!" : "Skoru Paylaş"}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
        .animate-slide-in { animation: slideIn 0.4s ease-out forwards; }
        @keyframes slideIn { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-pop-out { animation: popOut 0.5s ease-out forwards; }
        @keyframes popOut { 0% { transform: scale(0.5); opacity: 0; } 50% { transform: scale(1.1); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
      `}</style>
    </div>
  );
}
