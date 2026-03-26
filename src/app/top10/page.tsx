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
  const [today, setToday] = useState("");
  const [gameQuestions, setGameQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastFoundIdx, setLastFoundIdx] = useState<number | null>(null);
  
  const [difficulty, setDifficulty] = useState<'easy' | 'hard' | null>(null);
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

  const getLetterHint = (name: string) => {
    return name.split('').map(char => (char === ' ' ? '\u00A0\u00A0' : '_')).join(' ');
  };

  // 1. SORULARI YÜKLE
  useEffect(() => {
    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    setToday(dateStr);

    const filtered = allQuestions.filter(q => q.game === "top10" && q.activeDate <= dateStr);
    setGameQuestions(filtered);
    
    if (filtered.length > 0) {
      const latestIdx = filtered.length - 1;
      checkAndLoadQuestion(latestIdx, filtered);
    }
  }, []);

  // ARŞİV GEZİNTİSİ İÇİN KONTROL FONKSİYONU
  const checkAndLoadQuestion = (index: number, questionsList: any[]) => {
    if (index < 0 || index >= questionsList.length) return;
    
    setCurrentIndex(index);
    const question = questionsList[index];
    const savedSession = localStorage.getItem(`top10_session_${question.id}`);
    
    if (savedSession) {
      const data = JSON.parse(savedSession);
      setFoundIndices(data.foundIndices || []);
      setIsWin(data.isWin || false);
      setLives(data.lives ?? 3);
      setDifficulty(data.difficulty || 'hard');
      setIsGameOver(true);
    } else {
      setFoundIndices([]);
      setLives(3);
      setIsGameOver(false);
      setIsWin(false);
      setDifficulty(null);
    }
    setQuery('');
    setShowAll(false);
    setLastFoundIdx(null);
    setSuggestions([]);
  };

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

  const currentQ = gameQuestions[currentIndex];

  const finishGame = (winStatus: boolean) => {
    setIsGameOver(true);
    setIsActive(false);
    setIsWin(winStatus);
    const finalScore = winStatus ? 10 : foundIndices.length;
    
    if (currentQ) {
        localStorage.setItem(`top10_session_${currentQ.id}`, JSON.stringify({
            foundIndices: foundIndices,
            isWin: winStatus,
            lives: lives,
            difficulty: difficulty
        }));

        const newStats = { ...stats };
        newStats.totalGames += 1;
        if (winStatus) newStats.wins += 1;
        newStats.totalCorrect += finalScore;
        newStats.distribution[finalScore] += 1;
        setStats(newStats);
        localStorage.setItem('top10_stats_v2', JSON.stringify(newStats));
    }
    setShowStatsPopup(true);
  };

  const handleGuess = (guess: string) => {
    if (isGameOver || !currentQ) return;
    const normGuess = normalizeText(guess);
    const idx = currentQ.targets.findIndex((t: string) => normalizeText(t) === normGuess);

    if (idx !== -1 && !foundIndices.includes(idx)) {
      setLastFoundIdx(idx);
      setTimeout(() => {
        const newFound = [...foundIndices, idx];
        setFoundIndices(newFound);
        setLastFoundIdx(null);
        if (newFound.length === currentQ.targets.length) finishGame(true);
      }, 600); 
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

  if (!currentQ) return null;

  // ZORLUK SEÇİM EKRANI
  if (!difficulty && !isGameOver) {
    return (
      <div className="max-w-md mx-auto h-screen flex flex-col items-center justify-start pt-12 p-6 text-white bg-slate-950 font-sans text-center">
        {/* 1. Üst Kısım: Sadece Numara ve Oklar */}
        <div className="mb-2 flex items-center justify-center gap-6">
          <button 
            onClick={() => checkAndLoadQuestion(currentIndex - 1, gameQuestions)} 
            disabled={currentIndex === 0} 
            className="text-slate-700 hover:text-red-600 disabled:opacity-0 font-bebas text-4xl transition-colors"
          >
            ‹
          </button>
          <span className="text-red-600 font-bebas text-3xl leading-none">#{currentQ.id}</span>
          <button 
            onClick={() => checkAndLoadQuestion(currentIndex + 1, gameQuestions)} 
            disabled={currentIndex === gameQuestions.length - 1} 
            className="text-slate-700 hover:text-red-600 disabled:opacity-0 font-bebas text-4xl transition-colors"
          >
            ›
          </button>
        </div>

        {/* 2. Soru Başlığı */}
        <h2 className="mb-16 text-base font-bold text-slate-100 px-4 leading-tight italic">
          "{currentQ.title}"
        </h2>

        {/* 3. Oyun Zorluğu Yazısı (Küçültüldü) */}
        <div className="mb-8">
          <h3 className="text-red-600 font-bebas text-2xl tracking-[0.2em] uppercase opacity-90 leading-none">Oyun Zorluğu</h3>
          <div className="h-0.5 w-6 bg-red-600 mx-auto rounded-full opacity-40 mt-2"></div>
        </div>
        
        {/* 4. Zorluk Seçenekleri */}
        <div className="flex flex-col gap-5 w-full max-w-sm">
          <button 
            onClick={() => setDifficulty('easy')}
            className="group flex flex-col items-center p-6 bg-green-600/5 border-2 border-green-500/10 hover:border-green-500 hover:bg-green-600/10 rounded-3xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            <span className="text-green-500 font-bold text-xl mb-2 tracking-tight">KOLAY</span>
            <span className="text-slate-500 text-[11px] leading-relaxed font-medium group-hover:text-slate-300 transition-colors px-4">
              Bu modda cevaplardan her birinin kaçar harften oluştuğunu görebilirsin.
            </span>
          </button>

          <button 
            onClick={() => setDifficulty('hard')}
            className="group flex flex-col items-center p-6 bg-red-600/5 border-2 border-red-500/10 hover:border-red-500 hover:bg-red-600/10 rounded-3xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            <span className="text-red-500 font-bold text-xl mb-2 tracking-tight">ZOR</span>
            <span className="text-slate-500 text-[11px] leading-relaxed font-medium group-hover:text-slate-300 transition-colors px-4">
              Bu modda herhangi bir ipucu bulunmamaktadır. Tamamen hafızana güvenmelisin!
            </span>
          </button>
        </div>

        <Link href="/" className="mt-10 text-slate-600 hover:text-white transition-colors text-xs font-semibold tracking-tight">
          ← Vazgeç ve Geri Dön
        </Link>
      </div>
    );
  }
  const shareScore = () => {
    if (!currentQ) return;
    const diffEmoji = difficulty === 'easy' ? '🟢' : '🔴';
    const text = `Top 10 #${currentQ.id} (${difficulty === 'easy' ? 'Kolay' : 'Zor'})\nSkorum: ${foundIndices.length}/${currentQ.targets.length} ${diffEmoji}\nhttps://futboltrivia.com.tr/top10`;
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const maxDist = Math.max(...stats.distribution, 1);
  const correctRate = Math.round((stats.totalCorrect / (stats.totalGames * 10 || 1)) * 100);

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col p-3 text-white bg-slate-950 overflow-hidden font-sans relative">
      {isWin && <Confetti width={windowDimension.width} height={windowDimension.height} recycle={false} numberOfPieces={300} style={{ zIndex: 150 }} />}
      
      {showBigX && (
        <div className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <span className="text-red-600 text-9xl font-bebas animate-pop-out opacity-80 select-none font-sans">✕</span>
        </div>
      )}

      <div className="flex justify-between items-start mb-2 relative z-10 font-sans">
        <Link href="/" className="text-slate-500 font-bold text-xs hover:text-white transition-colors pt-1">← Geri Dön</Link>
        <div className="flex flex-col items-end font-sans">
          <div className="flex gap-1 mb-1 font-sans">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={`text-base transition-all duration-300 ${i < lives ? "opacity-100" : "opacity-20 grayscale"}`}>❤️</span>
            ))}
          </div>
          {lives === 1 && !isGameOver && <span className="text-[10px] font-bold text-red-500 animate-pulse italic uppercase font-sans">SON HAKKIN!</span>}
        </div>
      </div>

      <div className="text-center mb-3 relative z-10 font-sans">
        <div className="flex items-center justify-center gap-4 mb-0.5 font-sans">
          <button onClick={() => checkAndLoadQuestion(currentIndex - 1, gameQuestions)} disabled={currentIndex === 0 || isActive} className="text-slate-700 hover:text-red-600 disabled:opacity-0 font-bebas text-xl transition-colors font-sans">‹</button>
          <div className="font-bebas text-sm text-red-600 tracking-tighter uppercase font-sans">#{currentQ.id}</div>
          <button onClick={() => checkAndLoadQuestion(currentIndex + 1, gameQuestions)} disabled={currentIndex === gameQuestions.length - 1 || isActive} className="text-slate-700 hover:text-red-600 disabled:opacity-0 font-bebas text-xl transition-colors font-sans">›</button>
        </div>
        <h2 className="text-base font-bold leading-tight mb-2 px-2 text-slate-100 tracking-tight font-sans">{currentQ.title}</h2>
      </div>

      <div className="flex-grow overflow-y-hidden mb-3 px-1 relative z-10 space-y-1 font-sans">
        {currentQ.targets.map((name: string, i: number) => {
          const isFound = foundIndices.includes(i);
          const isJustFound = lastFoundIdx === i;

          return (
            <div 
              key={i} 
              className={`relative flex items-center justify-center h-9 px-4 rounded-xl border transition-all duration-500 overflow-hidden ${isFound ? "bg-green-600/10 border-green-500/40" : (showAll ? "bg-red-600/10 border-red-500/40" : "bg-slate-900/40 border-slate-900")}`}
            >
              {isJustFound && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-shimmer z-20 font-sans" />
              )}

              {isFound || showAll ? (
                <div className="flex items-center w-full animate-slide-in font-sans">
                  <span className="font-bold text-xs w-5 text-red-600 font-sans">{i + 1}.</span>
                  <span className="text-xs font-semibold tracking-tight text-white truncate font-sans">{formatName(name)}</span>
                  {isFound ? <span className="ml-auto text-green-500 text-[10px] font-sans">✓</span> : <span className="ml-auto text-red-500 text-[10px] font-sans">✕</span>}
                </div>
              ) : (
                <div className="flex items-center gap-3 font-sans">
                   <span className="font-bold text-slate-700 text-xs font-sans">{i + 1}</span>
                   <span className={`text-white transition-opacity duration-300 ${difficulty === 'easy' ? 'font-mono text-sm tracking-tighter opacity-40 font-sans' : 'opacity-0 font-sans'}`}>
                     {difficulty === 'easy' ? getLetterHint(name) : '???'}
                   </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showStatsPopup && (
        <div className="absolute inset-0 bg-slate-950/90 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-500 font-sans">
          <div className="w-full bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl relative text-white text-center font-sans">
            <button onClick={() => setShowStatsPopup(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors font-sans">✕</button>
            <h3 className="font-bold text-lg mb-6 italic font-sans">İstatistik</h3>
            
            <div className="flex justify-between mb-8 border-b border-slate-800 pb-6 text-center font-sans">
              <div className="flex-1 font-sans">
                <div className="text-2xl font-bold font-sans">{stats.totalGames}</div>
                <div className="text-[8px] text-slate-500 font-semibold mt-1 leading-tight font-sans">Oynanan oyun</div>
              </div>
              <div className="flex-1 border-x border-slate-800 font-sans">
                <div className="text-2xl font-bold text-green-500 font-sans">{Math.round((stats.wins / (stats.totalGames || 1)) * 100)}%</div>
                <div className="text-[8px] text-slate-500 font-semibold mt-1 leading-tight font-sans">Kazanma yüzdesi</div>
              </div>
              <div className="flex-1 font-sans">
                <div className="text-2xl font-bold text-sky-500 font-sans">{correctRate}%</div>
                <div className="text-[8px] text-slate-500 font-semibold mt-1 leading-tight font-sans">Doğru cevap yüzdesi</div>
              </div>
            </div>

            <div className="space-y-1.5 mb-8 font-sans">
              {stats.distribution.map((count, i) => (
                <div key={i} className="flex items-center gap-3 font-sans">
                  <span className="text-[10px] font-bold w-2 text-slate-500 font-sans">{i}</span>
                  <div className="flex-grow bg-slate-950/50 h-5 rounded overflow-hidden font-sans">
                    <div 
                      className={`h-full transition-all duration-1000 font-sans ${i === (isWin ? 10 : foundIndices.length) ? 'bg-red-600' : 'bg-slate-700'}`}
                      style={{ width: `${(count / maxDist) * 100 || 5}%` }}
                    >
                      <span className="text-[9px] font-bold px-2 flex items-center h-full text-white font-sans">{count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-2xl border border-slate-800 mb-4 font-sans">
                <div className="text-left font-sans">
                    <p className="text-slate-500 text-[10px] font-semibold font-sans">Sıradaki soru</p>
                    <p className="font-bold text-lg text-white mt-1 leading-none font-sans">{nextGameTime}</p>
                </div>
                {!isWin && !showAll && (
                  <button onClick={() => {setShowAll(true); setShowStatsPopup(false);}} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-bold transition-colors font-sans">Cevapları Gör</button>
                )}
            </div>

            <button onClick={shareScore} className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm active:scale-95 transition-all font-sans">
              {copySuccess ? "Kopyalandı!" : "Skoru Paylaş"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-auto relative z-10 font-sans">
        {!isGameOver ? (
          <div className="relative font-sans">
            {suggestions.length > 0 && (
              <div className="absolute bottom-full w-full mb-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-50 shadow-2xl font-sans">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => handleGuess(s)} className={`w-full p-3.5 text-left border-b border-slate-700 last:border-0 font-semibold text-white text-sm font-sans ${selectedIndex === i ? "bg-red-600 font-sans" : "hover:bg-red-600 font-sans"}`}>{formatName(s)}</button>
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
              placeholder={currentQ?.type.startsWith('team') ? "Takım ara..." : "Futbolcu ara..."} 
              className={`w-full p-4 bg-slate-900 rounded-2xl border-2 border-slate-800 focus:border-red-600 outline-none font-bold text-base text-white font-sans ${isError ? "border-red-600 animate-shake" : ""}`} 
            />
          </div>
        ) : (
          <div className="p-4 bg-slate-900 rounded-2xl border-2 border-slate-800 animate-in zoom-in duration-300 relative font-sans">
            <div className="flex items-center justify-between mb-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800 font-sans">
                <div className="text-left font-sans">
                    <p className="text-slate-500 text-[10px] font-semibold font-sans">Sıradaki soru</p>
                    <p className="font-bold text-lg text-white mt-1 leading-none font-sans">{nextGameTime}</p>
                </div>
                <button onClick={() => setShowStatsPopup(true)} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-bold transition-colors font-sans uppercase">İstatistik</button>
            </div>
            <button onClick={shareScore} className="w-full bg-white text-black py-3 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all active:scale-95 font-sans">
              {copySuccess ? "Kopyalandı!" : "Skoru Paylaş"}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
        .animate-slide-in { animation: slideIn 0.4s ease-out forwards; }
        @keyframes slideIn { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-pop-out { animation: popOut 0.5s ease-out forwards; }
        @keyframes popOut { 0% { transform: scale(0.5); opacity: 0; } 50% { transform: scale(1.1); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-20deg); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateX(100%) skewX(-20deg); opacity: 0; }
        }
        .animate-shimmer {
          animation: shimmer 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
