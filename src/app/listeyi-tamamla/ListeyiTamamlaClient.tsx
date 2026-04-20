'use client';

import { useState, useEffect, useRef } from 'react';
import playersData from '@/data/players.json';
import teamsData from '@/data/teams.json';
import europeanTeamsData from '@/data/european_teams.json';
import kolayQuestions from '@/data/questions-listeyi-tamamla-kolay.json';
import zorQuestions from '@/data/questions-listeyi-tamamla-zor.json';
const allQuestions = [...kolayQuestions, ...zorQuestions];
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

export default function ListeyiTamamlaClient({ difficulty }: { difficulty: 'kolay' | 'zor' }) {
  const [today, setToday] = useState("");
  const [gameQuestions, setGameQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    setToday(dateStr);

    const filtered = allQuestions.filter((q: any) =>
      q.game === "listeyi-tamamla" && q.activeDate <= dateStr && q.difficulty === difficulty
    );
    setGameQuestions(filtered);

    if (filtered.length > 0) {
      const latestIdx = filtered.length - 1;
      setCurrentIndex(latestIdx);

      const lastPlayed = localStorage.getItem(`listeyi_tamamla_${difficulty}_last_played_${filtered[latestIdx].id}`);
      if (lastPlayed === dateStr) {
        setIsGameOver(true);
        const savedSession = localStorage.getItem(`listeyi_tamamla_${difficulty}_session_${filtered[latestIdx].id}`);
        if (savedSession) {
          const data = JSON.parse(savedSession);
          setFoundItems(data.found || []);
          setIsWin(data.won || false);
        }
      }
    }

    const savedStats = localStorage.getItem(`listeyi_tamamla_${difficulty}_stats`);
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  useEffect(() => {
    setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
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
        .filter(item => !wrongGuesses.some(w => normalizeText(w) === normalizeText(item)))
        .slice(0, 5);
      setSuggestions(filtered);
      setSelectedIndex(0);
    } else {
      setSuggestions([]);
    }
  }, [query, foundItems, wrongGuesses, gameQuestions, currentIndex]);

  const currentQ = gameQuestions[currentIndex];

  // Bug fix: effectiveFoundItems parametresi eklendi — stale closure sorununu çözer.
  // handleGuess'ten çağrıldığında state henüz güncellenmediği için
  // yeni listeyi doğrudan argüman olarak iletiyoruz.
  const finishGame = (won: boolean, effectiveFoundItems?: string[]) => {
    if (isGameOver) return;

    const itemsToSave = effectiveFoundItems ?? foundItems;

    setIsGameOver(true);
    setIsActive(false);
    setIsWin(won);

    if (currentQ) {
      const finalScore = won ? currentQ.targets.length : itemsToSave.length;

      localStorage.setItem(`listeyi_tamamla_${difficulty}_last_played_${currentQ.id}`, today);
      localStorage.setItem(`listeyi_tamamla_${difficulty}_session_${currentQ.id}`, JSON.stringify({
        found: itemsToSave,
        won: won
      }));

      const currentStatsRaw = localStorage.getItem(`listeyi_tamamla_${difficulty}_stats`);
      const currentStats = currentStatsRaw
        ? JSON.parse(currentStatsRaw)
        : { totalGames: 0, wins: 0, bestScore: 0, highestPercentage: 0 };

      const currentPercentage = Math.round((finalScore / currentQ.targets.length) * 100);

      const updatedStats = {
        totalGames: currentStats.totalGames + 1,
        wins: won ? currentStats.wins + 1 : currentStats.wins,
        bestScore: Math.max(currentStats.bestScore, finalScore),
        highestPercentage: Math.max(currentStats.highestPercentage, currentPercentage)
      };

      setStats(updatedStats);
      localStorage.setItem(`listeyi_tamamla_${difficulty}_stats`, JSON.stringify(updatedStats));
    }

    setTimeout(() => setShowStatsPopup(true), 1000);
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
      // Bug fix: newFound geçiriliyor — state henüz güncellenmedi
      if (newFound.length === currentQ.targets.length) finishGame(true, newFound);
    } else {
      if (!wrongGuesses.some(w => normalizeText(w) === normalizeText(guess))) {
        setWrongGuesses(prev => [...prev, guess]);
      }
    }
    setQuery('');
    setSuggestions([]);
  };

  const handleShare = () => {
    if (!currentQ) return;
    const text = `Listeyi Tamamla #${currentQ.id} (${difficulty}) skorum: ${foundItems.length}/${currentQ.targets.length}\nEn yüksek doğru: ${stats.bestScore}\nhttps://futboltrivia.com.tr/listeyi-tamamla/${difficulty}`;
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (!currentQ) {
    return (
      <div className="max-w-md mx-auto h-screen flex flex-col items-center justify-center p-4 text-white bg-slate-950 text-center">
        <div className="w-12 h-12 border-b-2 border-slate-700 rounded-full mb-6" />
        <p className="text-slate-500 text-sm mb-2">Bu zorluk seviyesi için henüz soru eklenmedi.</p>
        <Link href="/listeyi-tamamla" className="mt-4 text-red-500 font-bold text-sm hover:underline">← Geri Dön</Link>
      </div>
    );
  }

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (timeLeft / 90) * circumference;

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-4 text-white bg-slate-950 relative overflow-y-auto">
      {isWin && <Confetti width={windowDimension.width} height={windowDimension.height} recycle={false} />}

      {/* Üst bar */}
      <div className="flex justify-between items-center mb-4 relative z-10">
        <Link href="/listeyi-tamamla" className="text-slate-500 font-bold text-xs hover:text-white transition-colors">← Geri Dön</Link>
        {!isGameOver && isActive && (
          <button
            onClick={() => giveUpConfirm
              ? finishGame(false)
              : (setGiveUpConfirm(true), setTimeout(() => setGiveUpConfirm(false), 3000))
            }
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
              giveUpConfirm
                ? 'bg-red-600 border-red-600 text-white animate-pulse'
                : 'text-red-600 border-red-900/30 hover:border-red-600/50'
            }`}
          >
            {giveUpConfirm ? 'Emin misin?' : 'Pes Et'}
          </button>
        )}
      </div>

      {/* Soru başlığı ve sayaç */}
      <div className="text-center mb-4 relative z-10">
        <div className="flex items-center justify-center gap-4 mb-2">
          <button
            onClick={() => {
              const newIdx = Math.max(0, currentIndex - 1);
              const targetQ = gameQuestions[newIdx];
              setCurrentIndex(newIdx);
              setWrongGuesses([]);
              setTimeLeft(90);
              setIsActive(false);
              setShowAll(false);
              const savedSession = localStorage.getItem(`listeyi_tamamla_${difficulty}_session_${targetQ.id}`);
              if (savedSession) {
                const data = JSON.parse(savedSession);
                setFoundItems(data.found || []);
                setIsWin(data.won || false);
                setIsGameOver(true);
              } else {
                setFoundItems([]);
                setIsWin(false);
                setIsGameOver(false);
              }
            }}
            disabled={currentIndex === 0 || isActive}
            className="text-slate-700 hover:text-red-500 disabled:opacity-0 font-bebas text-xl transition-colors"
            aria-label="Önceki soru"
          >‹</button>
          <div className="font-bebas text-sm text-red-500 tracking-tighter uppercase">#{currentQ.id}</div>
          <button
            onClick={() => {
              const newIdx = Math.min(gameQuestions.length - 1, currentIndex + 1);
              const targetQ = gameQuestions[newIdx];
              setCurrentIndex(newIdx);
              setWrongGuesses([]);
              setTimeLeft(90);
              setIsActive(false);
              setShowAll(false);
              const savedSession = localStorage.getItem(`listeyi_tamamla_${difficulty}_session_${targetQ.id}`);
              if (savedSession) {
                const data = JSON.parse(savedSession);
                setFoundItems(data.found || []);
                setIsWin(data.won || false);
                setIsGameOver(true);
              } else {
                setFoundItems([]);
                setIsWin(false);
                setIsGameOver(false);
              }
            }}
            disabled={currentIndex === gameQuestions.length - 1 || isActive}
            className="text-slate-700 hover:text-red-500 disabled:opacity-0 font-bebas text-xl transition-colors"
            aria-label="Sonraki soru"
          >›</button>
        </div>
        <h2 className="text-base font-bold leading-snug px-2 text-slate-100 tracking-tight">{currentQ.title}</h2>
        {currentQ.note && (
          <p className="text-slate-500 text-xs px-2 mt-1 mb-4 font-light italic">{currentQ.note}</p>
        )}

        {/* Sayaç + skor satırı */}
        <div className="flex justify-between items-center mb-4 px-4">
          <div className="text-left">
            <span className="font-bebas text-xs text-slate-500 block uppercase tracking-widest">Bulunan</span>
            <span className="font-bebas text-4xl text-white leading-none">
              {foundItems.length}
              <span className="text-slate-700 text-2xl">/{currentQ.targets.length}</span>
            </span>
          </div>

          <div className="relative w-24 h-24 flex items-center justify-center">
            {bonusAnim && (
              <div className="absolute -right-2 -top-2 text-green-400 font-bold text-xl animate-bounce-up z-20">
                +5
              </div>
            )}
            <svg className="transform -rotate-90 w-full h-full absolute inset-0" aria-hidden="true">
              <circle cx="48" cy="48" r={radius} stroke="#0f172a" strokeWidth="5" fill="transparent" />
              <circle
                cx="48" cy="48" r={radius}
                stroke={timeLeft <= 10 ? '#ef4444' : '#22c55e'}
                strokeWidth="5" fill="transparent"
                strokeDasharray={circumference}
                style={{ strokeDashoffset: isGameOver ? 0 : offset, transition: 'stroke-dashoffset 1s linear' }}
                strokeLinecap="round"
              />
            </svg>
            <span className="font-bebas text-3xl text-white">
              {isGameOver ? '✓' : timeLeft}
            </span>
          </div>
        </div>
      </div>

      {/* Bulunan / yanlış cevaplar */}
      <div className="flex-grow overflow-y-auto mb-4 px-1 custom-scrollbar relative z-10">
        <div className="flex flex-wrap gap-2 mb-4">
          {foundItems.map((p, i) => (
            <div key={i} className="bg-green-600/15 border border-green-500/30 px-3 py-1.5 rounded-lg animate-in zoom-in duration-200">
              <span className="text-xs font-semibold text-green-400">{formatName(p)}</span>
            </div>
          ))}
          {showAll && currentQ.targets
            .filter((t: string) => !foundItems.some(f => normalizeText(f) === normalizeText(t)))
            .map((t: string, i: number) => (
              <div key={i} className="bg-sky-900/20 border border-sky-400/20 px-3 py-1.5 rounded-lg">
                <span className="text-xs font-semibold text-sky-400">{formatName(t)}</span>
              </div>
            ))
          }
        </div>

        {!isGameOver && wrongGuesses.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-slate-900 pt-4">
            {wrongGuesses.map((w, i) => (
              <div key={i} className="bg-red-950/20 border border-red-900/30 px-3 py-1.5 rounded-lg">
                <span className="text-xs font-medium text-red-500/80">{formatName(w)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* İstatistik popup */}
      {showStatsPopup && (
        <div className="absolute inset-0 bg-slate-950/90 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="w-full bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl relative text-white text-center">
            <button
              onClick={() => setShowStatsPopup(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors text-lg"
              aria-label="Kapat"
            >✕</button>
            <h3 className="font-bold text-lg mb-6">İstatistikler</h3>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { value: stats.totalGames, label: 'Toplam oyun', color: 'text-white' },
                { value: stats.wins, label: 'Tamamlanan liste', color: 'text-green-400' },
                { value: stats.bestScore, label: 'Doğru cevap rekoru', color: 'text-red-400' },
                { value: `%${stats.highestPercentage}`, label: 'En iyi yüzde', color: 'text-sky-400' },
              ].map(({ value, label, color }) => (
                <div key={label} className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <div className={`text-2xl font-bold ${color}`}>{value}</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-2xl border border-slate-800 mb-4 text-left">
              <div>
                <p className="text-slate-500 text-[10px] font-bold">Sıradaki soru</p>
                <p className="font-bold text-lg text-white mt-1 leading-none tabular-nums">{nextGameTime}</p>
              </div>
              {!isWin && !showAll && (
                <button
                  onClick={() => { setShowAll(true); setShowStatsPopup(false); }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-bold transition-colors"
                >
                  Cevapları Gör
                </button>
              )}
            </div>

            <button
              onClick={handleShare}
              className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
            >
              {copySuccess ? 'Kopyalandı!' : 'Paylaş'}
            </button>
          </div>
        </div>
      )}

      {/* Giriş / oyun sonu */}
      <div className="mt-auto relative z-10 pb-4">
        {!isGameOver ? (
          <div className="relative">
            {suggestions.length > 0 && (
              <div className="absolute bottom-full w-full mb-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-50 shadow-2xl">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleGuess(s)}
                    className={`w-full p-3.5 text-left border-b border-slate-700/60 last:border-0 text-sm font-semibold text-white transition-colors ${selectedIndex === i ? 'bg-red-600' : 'hover:bg-red-600/80'}`}
                  >
                    {formatName(s)}
                  </button>
                ))}
              </div>
            )}
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.length > 0 && !isActive) setIsActive(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1)); }
                if (e.key === 'ArrowUp')   { e.preventDefault(); setSelectedIndex(prev => Math.max(prev - 1, 0)); }
                if (e.key === 'Enter' && suggestions[selectedIndex]) handleGuess(suggestions[selectedIndex]);
              }}
              placeholder={currentQ?.type.startsWith('team') ? 'Takım ara...' : 'Futbolcu ara...'}
              className="w-full p-4 bg-slate-900 rounded-2xl border-2 border-slate-800 focus:border-red-600 outline-none font-bold text-base text-white placeholder:text-slate-600 transition-colors"
            />
          </div>
        ) : (
          <div className="p-4 bg-slate-900 rounded-2xl border-2 border-slate-800 animate-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              <div className="text-left">
                <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wide">Sıradaki soru</p>
                <p className="font-bold text-lg text-white mt-1 leading-none tabular-nums">{nextGameTime}</p>
              </div>
              <button
                onClick={() => setShowStatsPopup(true)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-bold transition-colors"
              >
                İstatistik
              </button>
            </div>
            <button
              onClick={handleShare}
              className="w-full bg-white text-black py-3 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors active:scale-95"
            >
              {copySuccess ? 'KOPYALANDI' : 'PAYLAŞ'}
            </button>
          </div>
        )}
      </div>

      {/* SEO içerik bloğu */}
      <section className="mt-8 pt-6 border-t border-slate-900 pb-10">
        <h2 className="text-slate-600 text-xs tracking-[0.2em] uppercase mb-4">
          Listeyi Tamamla hakkında
        </h2>
        <div className="space-y-3 text-slate-700 text-xs leading-relaxed font-light">
          <p>
            Listeyi Tamamla, Süper Lig ve Türk futboluna ait günlük listeleri
            belirli bir süre içinde tamamlamaya çalıştığın bilgi yarışması oyunudur.
            Her gün yeni bir konu açıklanır ve 90 saniyelik geri sayım başlar.
          </p>
          <p>
            Tahmin yazmaya başladığın anda geri sayım devreye girer. Her doğru
            cevap süreye 5 saniye ekler; bu nedenle hızlı düşünmek kadar doğru
            düşünmek de önem taşır. Yanlış tahminler süreyi etkilemez.
          </p>
          <p>
            Sorular Süper Lig tarihini, milli takım kadrosunu, Avrupa kupalarındaki
            Türk kulüplerini ve belirli sezonlara ait istatistikleri kapsar.
          </p>
          <p>
            İstatistik sayfasında toplam oyun sayını, kaç listeyi tamamladığını,
            en fazla kaç doğru bulduğunu ve en yüksek yüzde skorunu görebilirsin.
          </p>
          <p>
            Sorular her gün güncellenir. Arşiv navigasyonuyla geçmiş soruları da
            oynayabilirsin.
          </p>
        </div>
      </section>
    </div>
  );
}
