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
  
  useEffect(() => {
    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    setToday(dateStr);

    const filtered = allQuestions.filter(q => 
      q.game === "listeyi-tamamla" && q.activeDate <= dateStr
    );
    setGameQuestions(filtered);
    if (filtered.length > 0) {
      setCurrentIndex(filtered.length - 1);
    }
  }, []);

  const currentQ = gameQuestions[currentIndex];

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
        .filter(item => !wrongGuesses.some(w => normalizeText(w) === normalizeText(item)))
        .slice(0, 5);
      setSuggestions(filtered);
      setSelectedIndex(0);
    } else { setSuggestions([]); }
  }, [query, foundItems, wrongGuesses, currentQ]);

  const finishGame = (won: boolean) => {
    setIsGameOver(true);
    setIsActive(false);
    setIsWin(won);
    if (currentQ) saveStats(won, foundItems.length, currentQ.targets.length);
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
      if (!wrongGuesses.some(w => normalizeText(w) === normalizedGuess)) setWrongGuesses(prev => [...prev, guess]);
    }
    setQuery('');
    setSuggestions([]);
  };

  const handleShare = () => {
    if (!currentQ) return;
    const text = `Listeyi Tamamla #${currentQ.id} skorum: ${foundItems.length}/${currentQ.targets.length}\nEn yüksek doğru: ${stats.bestScore}\nhttps://futbol-trivia.vercel.app/listeyi-tamamla`;
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
    <div className="max-w-md mx-auto h-screen flex flex-col p-4 text-white bg-slate-950 overflow-hidden font-sans relative font-sans">
      {isWin && <Confetti width={windowDimension.width} height={windowDimension.height} recycle={false} />}

      <div className="flex justify-between items-center mb-4 relative z-10 font-sans">
        <Link href="/" className="text-slate-500 font-bold text-xs hover:text-white transition-colors font-sans">← Geri Dön</Link>
        {!isGameOver && isActive && (
          <button 
            onClick={() => giveUpConfirm ? finishGame(false) : (setGiveUpConfirm(true), setTimeout(() => setGiveUpConfirm(false), 3000))} 
            className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all font-sans ${giveUpConfirm ? 'bg-red-600 border-red-600 text-white animate-pulse' : 'text-red-600 border-red-900/30'}`}
          >
            {giveUpConfirm ? 'Emin misin?' : 'Pes Et'}
          </button>
        )}
      </div>

      <div className="text-center mb-4 relative z-10 font-sans">
        <div className="flex items-center justify-center gap-4 mb-2 font-sans">
          <button onClick={() => { setCurrentIndex(prev => Math.max(0, prev - 1)); setFoundItems([]); setWrongGuesses([]); setTimeLeft(90); setIsGameOver(false); }} disabled={currentIndex === 0 || isActive} className="text-slate-700 hover:text-red-600 disabled:opacity-0 font-bebas text-xl transition-colors font-sans">‹</button>
          <div className="font-bebas text-sm text-red-600 tracking-tighter uppercase font-sans">#{currentQ.id}</div>
          <button onClick={() => { setCurrentIndex(prev => Math.min(gameQuestions.length - 1, prev + 1)); setFoundItems([]); setWrongGuesses([]); setTimeLeft(90); setIsGameOver(false); }} disabled={currentIndex === gameQuestions.length - 1 || isActive} className="text-slate-700 hover:text-red-600 disabled:opacity-0 font-bebas text-xl transition-colors font-sans">›</button>
        </div>
        <h2 className="text-lg font-bold leading-tight mb-4 px-2 text-slate-100 tracking-tight font-sans">{currentQ.title}</h2>
        
        <div className="flex justify-between items-center mb-4 px-6 font-sans">
            <div className="text-left font-sans font-sans">
                <span className="font-bebas text-xs text-slate-500 block uppercase tracking-widest font-sans">Bulunan</span>
                <span className="font-bebas text-4xl text-white font-sans">{foundItems.length}<span className="text-slate-700 text-2xl font-sans">/{currentQ.targets.length}</span></span>
            </div>
            <div className="relative w-24 h-24 flex items-center justify-center font-sans">
                {bonusAnim && <div className="absolute -right-2 -top-2 text-green-500 font-bold text-xl animate-bounce-up z-20 font-sans">+5</div>}
                <svg className="transform -rotate-90 w-full h-full absolute inset-0 font-sans">
                    <circle cx="48" cy="48" r={radius} stroke="#0f172a" strokeWidth="5" fill="transparent" />
                    <circle cx="48" cy="48" r={radius} stroke={timeLeft <= 10 ? '#ef4444' : '#22c55e'} strokeWidth="5" fill="transparent" strokeDasharray={circumference} style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1s linear' }} strokeLinecap="round" />
                </svg>
                <span className="font-bebas text-3xl text-white font-sans">{timeLeft}</span>
            </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto mb-4 px-1 custom-scrollbar relative z-10 font-sans">
        <div className="flex flex-wrap gap-2 mb-4 font-sans">
          {foundItems.map((p, i) => (
            <div key={i} className="bg-green-600/20 border border-green-500/40 px-3 py-1.5 rounded-lg animate-in zoom-in duration-200 font-sans">
              <span className="text-xs font-semibold text-green-400 font-sans">{formatName(p)}</span>
            </div>
          ))}
          {showAll && currentQ.targets.filter((t: string) => !foundItems.some(f => normalizeText(f) === normalizeText(t))).map((t: string, i: number) => (
            <div key={i} className="bg-sky-900/30 border border-sky-400/30 px-3 py-1.5 rounded-lg font-sans">
              <span className="text-xs font-semibold text-sky-400 font-sans">{formatName(t)}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 border-t border-slate-900 pt-4 font-sans font-sans">
          {wrongGuesses.map((w, i) => (
            <div key={i} className="bg-red-950/30 border border-red-900/40 px-3 py-1.5 rounded-lg animate-shake font-sans">
              <span className="text-xs font-medium text-red-500 font-sans">{formatName(w)}</span>
            </div>
          ))}
        </div>
      </div>

      {showStatsPopup && (
        <div className="absolute inset-0 bg-slate-950/90 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-500 font-sans font-sans">
          <div className="w-full bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl relative text-white text-center font-sans">
            <button onClick={() => setShowStatsPopup(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors font-sans">✕</button>
            <h3 className="font-bold text-lg mb-6 italic font-sans">İstatistikler</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-8 font-sans">
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 font-sans">
                <div className="text-2xl font-bold font-sans">{stats.totalGames}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-1 font-sans">Toplam oyun</div>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 font-sans">
                <div className="text-2xl font-bold text-green-500 font-sans">{stats.wins}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-1 font-sans">Tamamlanan liste</div>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 font-sans">
                <div className="text-2xl font-bold text-red-500 font-sans">{stats.bestScore}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-1 font-sans">Doğru cevap rekoru</div>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 font-sans">
                <div className="text-2xl font-bold text-sky-500 font-sans">%{stats.highestPercentage}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-1 font-sans">En iyi yüzde</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-2xl border border-slate-800 mb-6 text-left font-sans">
              <div>
                <p className="text-slate-500 text-[10px] font-bold font-sans">Sıradaki soru</p>
                <p className="font-bold text-lg text-white mt-1 leading-none font-sans">{nextGameTime}</p>
              </div>
              {!isWin && !showAll && (
                <button onClick={() => { setShowAll(true); setShowStatsPopup(false); }} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-[11px] font-bold font-sans">Cevapları Gör</button>
              )}
            </div>

            <button onClick={handleShare} className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm active:scale-95 transition-transform font-sans">
              {copySuccess ? "Kopyalandı!" : "Paylaş"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-auto relative z-10 font-sans font-sans">
        {!isGameOver ? (
          <div className="relative font-sans">
            {suggestions.length > 0 && (
              <div className="absolute bottom-full w-full mb-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-50 shadow-2xl font-sans">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => handleGuess(s)} className={`w-full p-4 text-left border-b border-slate-700 last:border-0 text-sm font-semibold text-white font-sans ${selectedIndex === i ? "bg-red-600" : "hover:bg-red-600"}`}>{formatName(s)}</button>
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
              className="w-full p-4 bg-slate-900 rounded-2xl border-2 border-slate-800 focus:border-red-600 outline-none font-bold text-base font-sans text-white" 
            />
          </div>
        ) : (
          <div className="p-4 bg-slate-900 rounded-2xl border-2 border-slate-800 flex gap-2 font-sans">
            <button onClick={() => setShowStatsPopup(true)} className="flex-grow py-4 bg-slate-800 text-white rounded-xl font-bold text-sm tracking-wide font-sans">İSTATİSTİKLER</button>
            <button onClick={handleShare} className="px-8 py-4 bg-white text-black rounded-xl font-bold text-sm transition-all active:scale-95 font-sans">
               {copySuccess ? "KOPYALANDI" : "PAYLAŞ"}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
        @keyframes bounce-up { 0% { transform: translateY(0); opacity: 0; } 50% { transform: translateY(-20px); opacity: 1; } 100% { transform: translateY(-40px); opacity: 0; } }
        .animate-bounce-up { animation: bounce-up 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}
