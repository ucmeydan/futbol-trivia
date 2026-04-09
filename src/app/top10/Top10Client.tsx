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

export default function Top10Client() {
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

  useEffect(() => {
    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    setToday(dateStr);

    const filtered = allQuestions.filter((q: any) => q.game === "top10" && q.activeDate <= dateStr);
    setGameQuestions(filtered);

    if (filtered.length > 0) {
      const latestIdx = filtered.length - 1;
      checkAndLoadQuestion(latestIdx, filtered);
    }
  }, []);

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

  // Zorluk seçim ekranı
  if (!difficulty && !isGameOver) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-start pt-12 p-6 text-white bg-slate-950 text-center overflow-y-auto pb-10">
        <div className="mb-2 flex items-center justify-center gap-6">
          <button
            onClick={() => checkAndLoadQuestion(currentIndex - 1, gameQuestions)}
            disabled={currentIndex === 0}
            className="text-slate-700 hover:text-red-500 disabled:opacity-0 font-bebas text-4xl transition-colors"
            aria-label="Önceki soru"
          >‹</button>
          <span className="text-red-500 font-bebas text-3xl leading-none">#{currentQ.id}</span>
          <button
            onClick={() => checkAndLoadQuestion(currentIndex + 1, gameQuestions)}
            disabled={currentIndex === gameQuestions.length - 1}
            className="text-slate-700 hover:text-red-500 disabled:opacity-0 font-bebas text-4xl transition-colors"
            aria-label="Sonraki soru"
          >›</button>
        </div>

        <h2 className="mb-14 text-base font-bold text-slate-100 px-4 leading-tight">
          "{currentQ.title}"
        </h2>

        <div className="mb-8">
          <h3 className="text-red-500 font-bebas text-2xl tracking-[0.2em] uppercase leading-none">Oyun Zorluğu</h3>
          <div className="h-0.5 w-6 bg-red-600 mx-auto rounded-full opacity-40 mt-2" />
        </div>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={() => setDifficulty('easy')}
            className="group flex flex-col items-center p-6 bg-green-600/5 border-2 border-green-500/10 hover:border-green-500 hover:bg-green-600/10 rounded-3xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            <span className="text-green-400 font-bold text-xl mb-2 tracking-tight">KOLAY</span>
            <span className="text-slate-500 text-xs leading-relaxed font-medium group-hover:text-slate-300 transition-colors px-4">
              Bu modda cevaplardan her birinin kaçar harften oluştuğunu görebilirsin.
            </span>
          </button>

          <button
            onClick={() => setDifficulty('hard')}
            className="group flex flex-col items-center p-6 bg-red-600/5 border-2 border-red-500/10 hover:border-red-500 hover:bg-red-600/10 rounded-3xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            <span className="text-red-400 font-bold text-xl mb-2 tracking-tight">ZOR</span>
            <span className="text-slate-500 text-xs leading-relaxed font-medium group-hover:text-slate-300 transition-colors px-4">
              Bu modda herhangi bir ipucu bulunmamaktadır. Tamamen hafızana güvenmelisin!
            </span>
          </button>
        </div>

        <Link href="/" className="mt-10 text-slate-600 hover:text-white transition-colors text-xs font-semibold">
          ← Vazgeç ve Geri Dön
        </Link>

        <section className="mt-16 pt-8 border-t border-slate-900 w-full text-left">
          <h2 className="text-slate-600 text-xs tracking-[0.2em] uppercase mb-4">Top 10 hakkında</h2>
          <div className="space-y-3 text-slate-700 text-xs leading-relaxed font-light">
            <p>
              Top 10, Süper Lig ve Türk futboluna ait istatistik listelerini tamamlamaya
              çalıştığın günlük bir bilgi yarışması oyunudur. Her soruda belirli bir
              kategoriye ait 10 ismi bulmak hedeflenir; doğru sıralama aranmaz.
            </p>
            <p>
              Kolay modda her ismin kaç harften oluştuğunu gösteren ipuçları görünür.
              Zor modda ise herhangi bir ipucu sunulmaz. Her iki modda 3 yanlış tahmin hakkın vardır.
            </p>
            <p>
              Sorular Süper Lig tarihini, milli takım kadrosunu, Avrupa kupalarındaki
              Türk kulüplerini ve özel kategorileri kapsar. Her gün yeni bir soru gelir.
            </p>
          </div>
        </section>
      </div>
    );
  }

  const shareScore = () => {
    if (!currentQ) return;
    const text = `Top 10 #${currentQ.id} (${difficulty === 'easy' ? 'Kolay' : 'Zor'})\nSkorum: ${foundIndices.length}/${currentQ.targets.length}\nhttps://futboltrivia.com.tr/top10`;
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const maxDist = Math.max(...stats.distribution, 1);
  const correctRate = Math.round((stats.totalCorrect / (stats.totalGames * 10 || 1)) * 100);

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-3 text-white bg-slate-950 relative overflow-y-auto">
      {isWin && <Confetti width={windowDimension.width} height={windowDimension.height} recycle={false} numberOfPieces={300} style={{ zIndex: 150 }} />}

      {showBigX && (
        <div className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none" aria-hidden="true">
          <span className="text-red-600 text-9xl font-bebas animate-pop-out opacity-80 select-none">✕</span>
        </div>
      )}

      {/* Üst bar */}
      <div className="flex justify-between items-start mb-2 relative z-10">
        <Link href="/" className="text-slate-500 font-bold text-xs hover:text-white transition-colors pt-1">← Geri Dön</Link>
        <div className="flex flex-col items-end">
          <div className="flex gap-1 mb-1" aria-label={`${lives} can kaldı`}>
            {[...Array(3)].map((_, i) => (
              <span key={i} className={`text-base transition-all duration-300 ${i < lives ? 'opacity-100' : 'opacity-20 grayscale'}`}>❤️</span>
            ))}
          </div>
          {lives === 1 && !isGameOver && (
            <span className="text-[10px] font-bold text-red-500 animate-pulse italic uppercase">SON HAKKIN!</span>
          )}
        </div>
      </div>

      {/* Soru başlığı */}
      <div className="text-center mb-3 relative z-10">
        <div className="flex items-center justify-center gap-4 mb-0.5">
          <button
            onClick={() => checkAndLoadQuestion(currentIndex - 1, gameQuestions)}
            disabled={currentIndex === 0 || isActive}
            className="text-slate-700 hover:text-red-500 disabled:opacity-0 font-bebas text-xl transition-colors"
            aria-label="Önceki soru"
          >‹</button>
          <div className="font-bebas text-sm text-red-500 tracking-tighter uppercase">#{currentQ.id}</div>
          <button
            onClick={() => checkAndLoadQuestion(currentIndex + 1, gameQuestions)}
            disabled={currentIndex === gameQuestions.length - 1 || isActive}
            className="text-slate-700 hover:text-red-500 disabled:opacity-0 font-bebas text-xl transition-colors"
            aria-label="Sonraki soru"
          >›</button>
        </div>
        <h2 className="text-base font-bold leading-tight mb-2 px-2 text-slate-100 tracking-tight">{currentQ.title}</h2>
      </div>

      {/* Liste */}
      <div className="flex-grow mb-3 px-1 relative z-10 space-y-1">
        {currentQ.targets.map((name: string, i: number) => {
          const isFound = foundIndices.includes(i);
          const isJustFound = lastFoundIdx === i;

          return (
            <div
              key={i}
              className={`relative flex items-center justify-center h-9 px-4 rounded-xl border transition-all duration-500 overflow-hidden ${
                isFound
                  ? 'bg-green-600/10 border-green-500/30'
                  : showAll
                  ? 'bg-red-600/10 border-red-500/30'
                  : 'bg-slate-900/40 border-slate-900'
              }`}
            >
              {isJustFound && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-shimmer z-20" aria-hidden="true" />
              )}
              {isFound || showAll ? (
                <div className="flex items-center w-full animate-slide-in">
                  <span className="font-bold text-xs w-5 text-red-500">{i + 1}.</span>
                  <span className="text-xs font-semibold tracking-tight text-white truncate">{formatName(name)}</span>
                  {isFound
                    ? <span className="ml-auto text-green-400 text-[10px]">✓</span>
                    : <span className="ml-auto text-red-400 text-[10px]">✕</span>
                  }
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-700 text-xs">{i + 1}</span>
                  <span className={`text-white transition-opacity duration-300 ${difficulty === 'easy' ? 'font-mono text-sm tracking-tighter opacity-40' : 'opacity-0'}`}>
                    {difficulty === 'easy' ? getLetterHint(name) : '???'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
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
            <h3 className="font-bold text-lg mb-6">İstatistik</h3>

            <div className="flex justify-between mb-6 border-b border-slate-800 pb-6 text-center">
              <div className="flex-1">
                <div className="text-2xl font-bold">{stats.totalGames}</div>
                <div className="text-[9px] text-slate-500 font-semibold mt-1 leading-tight">Oynanan oyun</div>
              </div>
              <div className="flex-1 border-x border-slate-800">
                <div className="text-2xl font-bold text-green-400">{Math.round((stats.wins / (stats.totalGames || 1)) * 100)}%</div>
                <div className="text-[9px] text-slate-500 font-semibold mt-1 leading-tight">Kazanma yüzdesi</div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-sky-400">{correctRate}%</div>
                <div className="text-[9px] text-slate-500 font-semibold mt-1 leading-tight">Doğru cevap yüzdesi</div>
              </div>
            </div>

            <div className="space-y-1.5 mb-6">
              {stats.distribution.map((count, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[10px] font-bold w-3 text-slate-500 text-right">{i}</span>
                  <div className="flex-grow bg-slate-950/50 h-5 rounded overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${i === (isWin ? 10 : foundIndices.length) ? 'bg-red-600' : 'bg-slate-700'}`}
                      style={{ width: `${(count / maxDist) * 100 || 5}%` }}
                    >
                      <span className="text-[9px] font-bold px-2 flex items-center h-full text-white">{count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-2xl border border-slate-800 mb-4 text-left">
              <div>
                <p className="text-slate-500 text-[10px] font-semibold">Sıradaki soru</p>
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
              onClick={shareScore}
              className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
            >
              {copySuccess ? 'Kopyalandı!' : 'Skoru Paylaş'}
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
                    className={`w-full p-3.5 text-left border-b border-slate-700/60 last:border-0 font-semibold text-white text-sm transition-colors ${selectedIndex === i ? 'bg-red-600' : 'hover:bg-red-600/80'}`}
                  >
                    {formatName(s)}
                  </button>
                ))}
              </div>
            )}
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); if (e.target.value.length > 0) setIsActive(true); }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1)); }
                if (e.key === 'ArrowUp')   { e.preventDefault(); setSelectedIndex(prev => Math.max(prev - 1, 0)); }
                if (e.key === 'Enter' && suggestions[selectedIndex]) handleGuess(suggestions[selectedIndex]);
              }}
              placeholder={currentQ?.type.startsWith('team') ? 'Takım ara...' : 'Futbolcu ara...'}
              className={`w-full p-4 bg-slate-900 rounded-2xl border-2 outline-none font-bold text-base text-white placeholder:text-slate-600 transition-colors ${
                isError ? 'border-red-600 animate-shake' : 'border-slate-800 focus:border-red-600'
              }`}
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
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-bold transition-colors uppercase"
              >
                İstatistik
              </button>
            </div>
            <button
              onClick={shareScore}
              className="w-full bg-white text-black py-3 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors active:scale-95"
            >
              {copySuccess ? 'Kopyalandı!' : 'Skoru Paylaş'}
            </button>
          </div>
        )}
      </div>

      {/* SEO içerik bloğu */}
      <section className="mt-6 pt-6 border-t border-slate-900 pb-10">
        <h2 className="text-slate-600 text-xs tracking-[0.2em] uppercase mb-4">Top 10 hakkında</h2>
        <div className="space-y-3 text-slate-700 text-xs leading-relaxed font-light">
          <p>
            Top 10, Süper Lig ve Türk futboluna ait istatistik listelerini tamamlamaya
            çalıştığın günlük bir bilgi yarışması oyunudur. Her soruda belirli bir
            kategoriye ait 10 ismi bulmak hedeflenir; doğru sıralama aranmaz.
          </p>
          <p>
            Kolay modda her ismin kaç harften oluştuğunu gösteren ipuçları görünür.
            Zor modda ise herhangi bir ipucu sunulmaz. Her iki modda toplam 3 yanlış
            tahmin hakkın vardır.
          </p>
          <p>
            Sorular Süper Lig tarihini, gol krallıklarını, Türkiye Kupası
            şampiyonlarını, milli takım kadrosunu ve Avrupa kupalarını kapsar.
          </p>
          <p>
            İstatistik sayfasında toplam oyun sayını, kazanma yüzdeni ve doğru
            cevap dağılım grafiğini görebilirsin. Arşiv navigasyonuyla geçmiş soruları
            tekrar oynayabilirsin.
          </p>
        </div>
      </section>
    </div>
  );
}
