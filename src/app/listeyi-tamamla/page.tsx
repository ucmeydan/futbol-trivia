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

export default function ListeyiTamamlaPage() {
  const [today, setToday] = useState("");
  const [gameQuestions, setGameQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // State'ler
  const [query, setQuery] = useState('');
  const [foundItems, setFoundItems] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isActive, setIsActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [bonusAnim, setBonusAnim] = useState(false);
  const [nextGameTime, setNextGameTime] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [giveUpConfirm, setGiveUpConfirm] = useState(false);
  const [showStatsPopup, setShowStatsPopup] = useState(false);
  
  const [stats, setStats] = useState({
    totalGames: 0,
    wins: 0,
    bestScore: 0,
    highestPercentage: 0
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });

  // 1. ADIM: Tarih ve Soruları Yükle
  useEffect(() => {
    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    setToday(dateStr);

    const filtered = allQuestions.filter(q => 
      q.game === "listeyi-tamamla" && q.activeDate <= dateStr
    );
    setGameQuestions(filtered);
    
    if (filtered.length > 0) {
      const latestIdx = filtered.length - 1;
      setCurrentIndex(latestIdx);
      
      // 2. ADIM: Bu soru bugün zaten oynandı mı kontrol et?
      const lastPlayed = localStorage.getItem(`listeyi_tamamla_last_played_${filtered[latestIdx].id}`);
      if (lastPlayed === dateStr) {
        setIsGameOver(true);
        // Eğer kaydedilmiş bulunan cevaplar varsa onları da çekelim
        const savedSession = localStorage.getItem(`listeyi_tamamla_session_${filtered[latestIdx].id}`);
        if (savedSession) {
            const data = JSON.parse(savedSession);
            setFoundItems(data.found || []);
            setIsWin(data.won || false);
        }
      }
    }
  }, []);

  useEffect(() => {
    setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    const savedStats = localStorage.getItem('listeyi_tamamla_stats');
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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      finishGame(false);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  useEffect(() => {
    const currentQ = gameQuestions[currentIndex];
    if (query.length >= 2 && currentQ) {
      let sourceData: string[] = [];
      if (currentQ.type === 'player') sourceData = playersData as string[];
      else if (currentQ.type === 'team-tr' || currentQ.type === 'team') sourceData = teamsData as string[];
      else if (currentQ.type === 'team-eu') sourceData = europeanTeamsData as string[];
      
      const normalizedQuery = normalizeText(query);
      const uniqueItems = Array.from(new Set(sourceData));
      const filtered = uniqueItems
        .filter(item => normalizeText(item).includes(normalizedQuery))
        .filter(item => !foundItems.some(f => normalizeText(f) === normalizeText(item)))
        .filter(item => !wrongGuesses.some(w => normalizeText(w) === normalizeText(query)))
        .slice(0, 5);
      setSuggestions(filtered);
      setSelectedIndex(0);
    } else { setSuggestions([]); }
  }, [query, foundItems, wrongGuesses, gameQuestions, currentIndex]);

  const currentQ = gameQuestions[currentIndex];

  const finishGame = (won: boolean) => {
    setIsGameOver(true);
    setIsActive(false);
    setIsWin(won);
    
    if (currentQ) {
      const finalScore = won ? currentQ.targets.length : foundItems.length;
      
      // Bugün oynandığına dair kilidi vur
      localStorage.setItem(`listeyi_tamamla_last_played_${currentQ.id}`, today);
      
      // O anki oturum verilerini kaydet (Sayfa yenilendiğinde skorun doğru gelmesi için)
      localStorage.setItem(`listeyi_tamamla_session_${currentQ.id}`, JSON.stringify({
          found: foundItems,
          won: won
      }));

      saveStats(won, finalScore, currentQ.targets.length);
    }
    
    setShowStatsPopup(true);
  };

  const saveStats = (won: boolean, currentScore: number, totalInQuestion: number) => {
    const currentPercentage = Math.round((currentScore / totalInQuestion) * 100);
    const newStats = {
      totalGames: stats.totalGames + 1,
      wins: won ? stats.wins + 1 : stats.wins,
      bestScore: Math.max(stats.bestScore, currentScore),
      highestPercentage: Math.max(stats.highestPercentage, currentPercentage)
    };
    setStats(newStats);
    localStorage.setItem('listeyi_tamamla_stats', JSON.stringify(newStats));
  };

  const handleGuess = (guess: string) => {
    if (isGameOver || !currentQ) return;
    setGiveUpConfirm(false);
    const normalizedGuess = normalizeText(guess);
    const isCorrect = currentQ.targets.some((t: string) => normalizeText(t) === normalizedGuess);

    if (isCorrect) {
      const actualName = currentQ.targets.find((t: string) => normalizeText(t) === normalizedGuess)!;
      const newFound = [...foundItems, actualName];
      setFoundItems(newFound);
      setTimeLeft(prev => prev + 5);
      setBonusAnim(true);
      setTimeout(() => setBonusAnim(false), 800);
      
      if (newFound.length === currentQ.targets.length) finishGame(true);
    } else {
      if (!wrongGuesses.some(w => normalizeText(w) === normalizeText(guess))) setWrongGuesses(prev => [...prev, guess]);
    }
    setQuery('');
    setSuggestions([]);
  };

  const handleShare = () => {
    if (!currentQ) return;
    const text = `Listeyi Tamamla #${currentQ.id} skorum: ${foundItems.length}/${currentQ.targets.length}\nEn yüksek doğru: ${stats.bestScore}\nhttps://futboltrivia.com.tr/listeyi-tamamla`;
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (!currentQ) {
    return (
      <div className="max-w-md mx-auto h-screen flex flex-col items-center justify-center p-4 text-white bg-slate-950 font-sans text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4 font-sans"></div>
        <p className="font-sans">Soru yükleniyor...</p>
        <Link href="/" className="mt-8 text-red-500 font-bold underline font-sans">Anasayfaya Dön</Link>
      </div>
    );
  }

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (timeLeft / 90) * circumference;

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col p-4 text-white bg-slate-950 overflow-hidden font-sans relative">
      {isWin && <Confetti width={windowDimension.width} height={windowDimension.height} recycle={false} />}

      <div className="flex justify-between items-center mb-4 relative z-10">
        <Link href="/" className="text-slate-500 font-bold text-xs hover:text-white transition-colors">← Geri Dön</Link>
        {!isGameOver && isActive && (
          <button 
            onClick={() => giveUpConfirm ? finishGame(false) : (setGiveUpConfirm(true), setTimeout(() => setGiveUpConfirm(false), 3000))} 
            className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${giveUpConfirm ? 'bg-red-600 border-red-600 text-white animate-pulse' : 'text-red-600 border-red-900/30'}`}
          >
            {giveUpConfirm ? 'Emin misin?' : 'Pes Et'}
          </button>
        )}
      </div>

      <div className="text-center mb-4 relative z-10">
        <div className="flex items-center justify-center gap-4 mb-2">
          {/* Geçmiş soruları görme butonu sadece oyun bitmişse aktif kalsın veya engellensin */}
          <button onClick={() => { setCurrentIndex(prev => Math.max(0, prev - 1)); setFoundItems([]); setWrongGuesses([]); setTimeLeft(90); setIsGameOver(false); }} disabled={currentIndex === 0 || isActive || isGameOver} className="text-slate-700 hover:text-red-600 disabled:opacity-0 font-bebas text-xl transition-colors">‹</button>
          <div className="font-bebas text-sm text-red-600 tracking-tighter uppercase">#{currentQ.id}</div>
          <button onClick={() => { setCurrentIndex(prev => Math.min(gameQuestions.length - 1, prev + 1)); setFoundItems([]); setWrongGuesses([]); setTimeLeft(90); setIsGameOver(false); }} disabled={currentIndex === gameQuestions.length - 1 || isActive || isGameOver} className="text-slate-700 hover:text-red-600 disabled:opacity-0 font-bebas text-xl transition-colors">›</button>
        </div>
        <h2 className="text-lg font-bold leading-tight mb-4 px-2 text-slate-100 tracking-tight">{currentQ.title}</h2>
        
        <div className="flex justify-between items-center mb-4 px-6">
            <div className="text-left">
                <span className="font-bebas text-xs text-slate-500 block uppercase tracking-widest">Bulunan</span>
                <span className="font-bebas text-4xl text-white">{foundItems.length}<span className="text-slate-700 text-2xl">/{currentQ.targets.length}</span></span>
            </div>
            <div className="relative w-24 h-24 flex items-center justify-center">
                {bonusAnim && <div className="absolute -right-2 -top-2 text-green-500 font-bold text-xl animate-bounce-up z-20">+5</div>}
                <svg className="transform -rotate-90 w-full h-full absolute inset-0">
                    <circle cx="48" cy="48" r={radius} stroke="#0f172a" strokeWidth="5" fill="transparent" />
                    <circle cx="48" cy="48" r={radius} stroke={timeLeft <= 10 ? '#ef4444' : '#22c55e'} strokeWidth="5" fill="transparent" strokeDasharray={circumference} style={{ strokeDashoffset: isGameOver ? 0 : offset, transition: 'stroke-dashoffset 1s linear' }} strokeLinecap="round" />
                </svg>
                <span className="font-bebas text-3xl text-white">{isGameOver ? "✓" : timeLeft}</span>
            </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto mb-4 px-1 custom-scrollbar relative z-10">
        <div className="flex flex-wrap gap-2 mb-4">
          {foundItems.map((p, i) => (
            <div key={i} className="bg-green-600/20 border border-green-500/40 px-3 py-1.5 rounded-lg animate-in zoom-in duration-200">
              <span className="text-xs font-semibold text-green-400">{formatName(p)}</span>
            </div>
          ))}
          {showAll && currentQ.targets.filter((t: string) => !foundItems.some(f => normalizeText(f) === normalizeText(t))).map((t: string, i: number) => (
            <div key={i} className="bg-sky-900/30 border border-sky-400/30 px-3 py-1.5 rounded-lg">
              <span className="text-xs font-semibold text-sky-400">{formatName(t)}</span>
            </div>
          ))}
        </div>
        {!isGameOver && (
          <div className="flex flex-wrap gap-2 border-t border-slate-900 pt-4">
            {wrongGuesses.map((w, i) => (
              <div key={i} className="bg-red-950/30 border border-red-900/40 px-3 py-1.5 rounded-lg animate-shake">
                <span className="text-xs font-medium text-red-500">{formatName(w)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showStatsPopup && (
        <div className="absolute inset-0 bg-slate-950/90 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="w-full bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl relative text-white text-center">
            <button onClick={() => setShowStatsPopup(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">✕</button>
            <h3 className="font-bold text-lg mb-6 italic">İstatistikler</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                <div className="text-2xl font-bold">{stats.totalGames}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">Toplam oyun</div>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                <div className="text-2xl font-bold text-green-500">{stats.wins}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">Tamamlanan liste</div>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                <div className="text-2xl font-bold text-red-500">{stats.bestScore}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">Doğru cevap rekoru</div>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                <div className="text-2xl font-bold text-sky-500">%{stats.highestPercentage}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">En iyi yüzde</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-2xl border border-slate-800 mb-6 text-left">
              <div>
                <p className="text-slate-500 text-[10px] font-bold">Sıradaki soru</p>
                <p className="font-bold text-lg text-white mt-1 leading-none">{nextGameTime}</p>
              </div>
              {!isWin && !showAll && (
                <button onClick={() => { setShowAll(true); setShowStatsPopup(false); }} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-[11px] font-bold">Cevapları Gör</button>
              )}
            </div>

            <button onClick={handleShare} className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm active:scale-95 transition-transform">
              {copySuccess ? "Kopyalandı!" : "Paylaş"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-auto relative z-10">
        {!isGameOver ? (
          <div className="relative">
            {suggestions.length > 0 && (
              <div className="absolute bottom-full w-full mb-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-50 shadow-2xl">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => handleGuess(s)} className={`w-full p-4 text-left border-b border-slate-700 last:border-0 text-sm font-semibold text-white ${selectedIndex === i ? "bg-red-600" : "hover:bg-red-600"}`}>{formatName(s)}</button>
                ))}
              </div>
            )}
            <input 
              ref={inputRef} value={query} 
              onChange={(e) => { setQuery(e.target.value); if (e.target.value.length > 0 && !isActive) setIsActive(true); }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev)); }
                if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev)); }
                if (e.key === 'Enter' && suggestions[selectedIndex]) handleGuess(suggestions[selectedIndex]);
              }} 
              placeholder={currentQ?.type.startsWith('team') ? "Takım ara..." : "Futbolcu ara..."} 
              className="w-full p-4 bg-slate-900 rounded-2xl border-2 border-slate-800 focus:border-red-600 outline-none font-bold text-base text-white" 
            />
          </div>
        ) : (
          <div className="p-4 bg-slate-900 rounded-2xl border-2 border-slate-800 animate-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <div className="text-left">
                    <p className="text-slate-500 text-[10px] font-semibold uppercase">Sıradaki soru</p>
                    <p className="font-bold text-lg text-white mt-1 leading-none">{nextGameTime}</p>
                </div>
                <button onClick={() => setShowStatsPopup(true)} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-bold transition-colors">İstatistik</button>
            </div>
            <button onClick={handleShare} className="w-full bg-white text-black py-3 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all active:scale-95">
               {copySuccess ? "KOPYALANDI" : "PAYLAŞ"}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
        @keyframes bounce-up { 0% { transform: translateY(0); opacity: 0; } 50% { transform: translateY(-20px); opacity: 1; } 100% { transform: translateY(-40px); opacity: 0; } }
        .animate-bounce-up { animation: bounce-up 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}
