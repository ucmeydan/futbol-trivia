'use client';

import { useState, useEffect } from 'react';
import playersData from '@/data/players.json';
import allQuestions from '@/data/questions.json';
import Link from 'next/link';
import Confetti from 'react-confetti';

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

const formatName = (name: string) => {
  if (!name) return "";
  return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function TakimArkadasiPage() {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [showError, setShowError] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [gameQuestions, setGameQuestions] = useState<any[]>([]);
  const [showStatsPage, setShowStatsPage] = useState(false);
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });

  const [stats, setStats] = useState({
    totalGames: 0,
    wins: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });

  useEffect(() => {
    setMounted(true);
    setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    
    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    const filtered = allQuestions.filter(q => 
      q.game === "takim-arkadasi" && q.activeDate <= dateStr
    );
    setGameQuestions(filtered);
    if (filtered.length > 0) {
      setCurrentIndex(filtered.length - 1);
    }

    const savedStats = localStorage.getItem('takim_arkadasi_stats_v1');
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const normalizedQuery = normalizeText(query);
      const uniquePlayers = Array.from(new Set(playersData as string[]));
      const filtered = uniquePlayers
        .filter(item => normalizeText(item).includes(normalizedQuery))
        .slice(0, 5);
      setSuggestions(filtered);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const currentQ = gameQuestions[currentIndex];

  const updateStats = (won: boolean, attemptCount: number) => {
    const newStats = { ...stats };
    newStats.totalGames += 1;
    if (won) {
      newStats.wins += 1;
      newStats.distribution[attemptCount as keyof typeof stats.distribution] += 1;
    }
    setStats(newStats);
    localStorage.setItem('takim_arkadasi_stats_v1', JSON.stringify(newStats));
  };

  const handleGuess = (guess: string) => {
    if (isGameOver || !currentQ) return;
    const normalizedGuess = normalizeText(guess);
    const normalizedCorrect = normalizeText(currentQ.correctPlayer);

    if (normalizedGuess === normalizedCorrect) {
      setIsWin(true);
      setIsGameOver(true);
      updateStats(true, attempts);
      setTimeout(() => setShowStatsPage(true), 1500);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 800);
      if (attempts < 5) {
        setAttempts(prev => prev + 1);
      } else {
        setIsGameOver(true);
        updateStats(false, 0);
        setTimeout(() => setShowStatsPage(true), 1500);
      }
    }
    setQuery('');
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleGuess(suggestions[selectedIndex]);
    }
  };

  const shareScore = () => {
    if (!currentQ) return;
    const text = `Takım Arkadaşı #${currentQ.id} skorum: ${isWin ? attempts + ". denemede bildim!" : "bilemedim."}\nhttps://futboltrivia.com.tr/takim-arkadasi`;
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  if (!mounted || !currentQ) return <div className="min-h-screen bg-slate-950"></div>;

  const winPercentage = stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0;
  const maxDist = Math.max(...Object.values(stats.distribution), 1);

  if (showStatsPage) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex flex-col p-6 text-white bg-slate-950 font-sans justify-center">
        <div className="w-full bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative text-center">
          <button onClick={() => setShowStatsPage(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">✕</button>
          <h3 className="font-bold text-lg mb-8 italic">İstatistikler</h3>
          
          <div className="flex justify-between mb-10 border-b border-slate-800 pb-6 text-center">
            <div className="flex-1">
              <div className="text-2xl font-black">{stats.totalGames}</div>
              <div className="text-[9px] text-slate-500 font-bold tracking-tight">Oynanan Oyun</div>
            </div>
            <div className="flex-1 border-x border-slate-800">
              <div className="text-2xl font-black text-red-600">{winPercentage}%</div>
              <div className="text-[9px] text-slate-500 font-bold tracking-tight">Galibiyet Yüzdesi</div>
            </div>
            <div className="flex-1">
              <div className="text-2xl font-black text-green-500">{stats.wins}</div>
              <div className="text-[9px] text-slate-500 font-bold tracking-tight">Kazanılan Oyun</div>
            </div>
          </div>

          <div className="space-y-3 mb-10 text-left">
            <p className="text-[10px] text-slate-500 font-bold tracking-widest mb-4">Tahmin Dağılımı</p>
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-center gap-3">
                <span className="text-[11px] font-bold w-4 text-slate-500">{num}</span>
                <div className="flex-grow bg-slate-950 h-5 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full transition-all duration-1000 flex items-center px-2 ${isWin && num === attempts ? 'bg-red-600' : 'bg-slate-700'}`} 
                    style={{ width: `${(stats.distribution[num as keyof typeof stats.distribution] / maxDist) * 100 || 5}%` }}
                  >
                    <span className="text-[10px] font-bold text-white">{stats.distribution[num as keyof typeof stats.distribution]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={shareScore} className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm active:scale-95 transition-all mb-3">
            {copySuccess ? "Kopyalandı!" : "Skoru Paylaş"}
          </button>
          <button onClick={() => setShowStatsPage(false)} className="w-full bg-slate-800 text-white py-3 rounded-xl text-xs font-semibold">Kapat</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col p-4 text-white bg-slate-950 font-sans relative overflow-hidden">
      {isWin && <Confetti width={windowDimension.width} height={windowDimension.height} recycle={false} />}

      <div className="flex flex-col items-center mb-8">
        <div className="w-full flex justify-between items-center mb-4">
          <Link href="/" className="text-slate-500 font-medium text-xs hover:text-white transition-colors">← Geri dön</Link>
          <div className="flex items-center gap-4">
            <button onClick={() => { setCurrentIndex(prev => Math.max(0, prev - 1)); setIsGameOver(false); setAttempts(1); }} disabled={currentIndex === 0 || isGameOver} className="text-slate-600 hover:text-white disabled:opacity-0 text-xl font-sans">‹</button>
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-light tracking-tight text-red-600 font-sans">Takım Arkadaşı</h1>
              <span className="text-sm font-black text-red-600 tracking-widest mt-1 font-sans">#{currentQ.id}</span>
            </div>
            <button onClick={() => { setCurrentIndex(prev => Math.min(gameQuestions.length - 1, prev + 1)); setIsGameOver(false); setAttempts(1); }} disabled={currentIndex === gameQuestions.length - 1 || isGameOver} className="text-slate-600 hover:text-white disabled:opacity-0 text-xl font-sans">›</button>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex flex-col items-center mb-8 mt-2">
        <div className={`w-full h-20 flex items-center justify-center rounded-2xl border-2 transition-all duration-700 shadow-2xl ${!isGameOver ? 'border-slate-800 bg-slate-900/50' : isWin ? 'border-green-500 bg-green-600' : 'border-red-500 bg-red-600'}`}>
          <span className={`font-bold text-center px-4 transition-all duration-500 font-sans ${isGameOver ? 'text-xl text-white' : 'text-4xl text-slate-700'}`}>
            {isGameOver ? currentQ.correctPlayer : "?"}
          </span>
        </div>
        <p className="text-slate-400 text-[13px] font-medium text-center mt-6 px-6 leading-snug font-sans">Bu 5 futbolcuyla aynı takımda oynamış olan oyuncu kim?</p>
      </div>

      <div className="flex flex-col gap-2.5 mb-8">
        {currentQ.teammates.map((name: string, index: number) => {
          const isOpened = index < attempts || isGameOver;
          return (
            <div key={index} className={`h-14 flex items-center justify-center rounded-xl border transition-all duration-500 font-sans ${isOpened ? 'border-slate-700 bg-slate-900 text-slate-100 shadow-md' : 'border-slate-900 bg-slate-950 text-slate-800'}`}>
              <span className="text-base font-bold font-sans">{isOpened ? formatName(name) : index + 1}</span>
            </div>
          );
        })}
      </div>

      {showError && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none">
          <div className="text-red-500 text-9xl font-black animate-error-ping font-sans">✕</div>
        </div>
      )}

      <div className="mt-auto pb-6">
        {!isGameOver ? (
          <div className="relative">
             {suggestions.length > 0 && (
              <div className="absolute bottom-full w-full mb-3 bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden z-50 shadow-2xl font-sans">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => handleGuess(s)} className={`w-full p-4 text-left border-b border-slate-700 text-sm font-semibold text-white font-sans ${selectedIndex === i ? "bg-red-600" : "hover:bg-red-600"} transition-colors`}>
                    {formatName(s)}
                  </button>
                ))}
              </div>
            )}
            <input 
              value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Futbolcu ismini yazın..." 
              className="w-full p-4 bg-slate-900 rounded-2xl border-2 border-slate-800 focus:border-slate-600 outline-none font-bold text-white transition-all placeholder:text-slate-600 font-sans" 
            />
            <div className="flex justify-center mt-4">
              <button onClick={() => handleGuess("pas")} className="text-amber-400 hover:text-amber-300 font-bold text-xs underline tracking-widest transition-colors font-sans">Pas Geç</button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-900 border-2 border-slate-800 animate-in zoom-in duration-300 relative rounded-2xl font-sans">
            <div className="flex items-center justify-between mb-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800 font-sans">
                <div className="text-left font-sans">
                    <p className={`font-bold text-lg leading-none mb-1 font-sans ${isWin ? 'text-green-500' : 'text-red-500'}`}> {isWin ? 'Tebrikler!' : 'Maalesef!'} </p>
                    <p className="font-bold text-base text-white tracking-tight font-sans"> {formatName(currentQ.correctPlayer)} </p>
                </div>
                <button onClick={() => setShowStatsPage(true)} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-bold transition-colors font-sans">İstatistik</button>
            </div>
            <button onClick={shareScore} className="w-full bg-white text-black py-3 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all active:scale-95 font-sans">Skoru Paylaş</button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes error-ping { 0% { transform: scale(0.5); opacity: 0; } 50% { opacity: 0.8; } 100% { transform: scale(1.2); opacity: 0; } }
        .animate-error-ping { animation: error-ping 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
}