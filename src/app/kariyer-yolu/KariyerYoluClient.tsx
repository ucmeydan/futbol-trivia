'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Confetti from 'react-confetti';
import playersData from '@/data/players.json';
import allQuestions from '@/data/questions.json';

const toTitleCase = (str: string) => {
  if (!str) return "";
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

export default function KariyerYoluClient({ difficulty }: { difficulty: 'kolay' | 'zor' }) {
  const [gameQuestions, setGameQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [visibleRows, setVisibleRows] = useState(1);
  const [finalAttempt, setFinalAttempt] = useState(0);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showStatsPage, setShowStatsPage] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });

  const [stats, setStats] = useState({
    totalGames: 0,
    wins: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, "7+": 0 }
  });

  useEffect(() => {
    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const filtered = allQuestions.filter((q: any) => q.game === "kariyer-yolu" && q.activeDate <= dateStr && q.difficulty === difficulty);
    setGameQuestions(filtered);
    if (filtered.length > 0) {
      loadQuestion(filtered.length - 1, filtered);
    }
  }, []);

  const loadQuestion = (index: number, questionsList: any[]) => {
    if (index < 0 || index >= questionsList.length) return;
    const question = questionsList[index];
    setCurrentIndex(index);
    const savedSession = localStorage.getItem(`kariyer_yolu_${difficulty}_session_${question.id}`);
    if (savedSession) {
      const data = JSON.parse(savedSession);
      setVisibleRows(data.visibleRows || question.career.length);
      setIsGameOver(true);
      setIsWin(data.isWin || false);
      setFinalAttempt(data.finalAttempt || 0);
    } else {
      setVisibleRows(1);
      setIsGameOver(false);
      setIsWin(false);
      setFinalAttempt(0);
    }
    setQuery('');
    setSuggestions([]);
  };

  useEffect(() => {
    setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    const savedStats = localStorage.getItem(`kariyer_yolu_${difficulty}_stats_v1`);
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  const normalizeText = (text: string) => {
    return text.trim().toLowerCase()
      .replace(/İ/g, 'i').replace(/I/g, 'i').replace(/ı/g, 'i')
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const currentQ = gameQuestions[currentIndex];

  const updateStats = (win: boolean, attempt: number) => {
    if (!currentQ) return;
    const newStats = { ...stats };
    newStats.totalGames += 1;
    if (win) {
      newStats.wins += 1;
      const key = attempt >= 7 ? "7+" : attempt.toString();
      newStats.distribution[key as keyof typeof stats.distribution] += 1;
    }
    setStats(newStats);
    localStorage.setItem(`kariyer_yolu_${difficulty}_stats_v1`, JSON.stringify(newStats));
    localStorage.setItem(`kariyer_yolu_${difficulty}_session_${currentQ.id}`, JSON.stringify({
      visibleRows: win ? attempt : currentQ.career.length,
      isWin: win,
      finalAttempt: win ? attempt : 0
    }));
  };

  const handleGuess = (guess: string) => {
    if (isGameOver || !currentQ) return;
    const normGuess = normalizeText(guess);
    const normCorrect = normalizeText(currentQ.correctPlayer);

    if (normGuess === normCorrect) {
      setFinalAttempt(visibleRows);
      setIsWin(true);
      setIsGameOver(true);
      updateStats(true, visibleRows);
      setVisibleRows(currentQ.career.length);
      setTimeout(() => setShowStatsPage(true), 1500);
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
      if (visibleRows < currentQ.career.length) {
        setVisibleRows(prev => prev + 1);
      } else {
        setIsGameOver(true);
        setIsWin(false);
        setFinalAttempt(0);
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

  useEffect(() => {
    if (query.length >= 2) {
      const normalizedQuery = normalizeText(query);
      const uniquePlayers = Array.from(new Set(playersData as string[]));
      const filtered = uniquePlayers
        .filter(p => normalizeText(p).includes(normalizedQuery))
        .slice(0, 5);
      setSuggestions(filtered);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const shareScore = () => {
    if (!currentQ) return;
    const scoreText = isWin ? `${finalAttempt}. denemede bildim!` : "Maalesef bilemedim.";
    const text = `Futbol Trivia - Kariyer Yolu #${currentQ.id} (${difficulty})\nSkorum: ${scoreText}\nhttps://futboltrivia.com.tr/kariyer-yolu/${difficulty}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const winPercentage = stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0;
  const maxDist = Math.max(...Object.values(stats.distribution), 1);

  if (!currentQ) {
    return (
      <div className="max-w-md mx-auto h-screen flex flex-col items-center justify-center p-4 text-white bg-slate-950 text-center">
        <div className="w-12 h-12 border-b-2 border-slate-700 rounded-full mb-6" />
        <p className="text-slate-500 text-sm mb-2">Bu zorluk seviyesi için henüz soru eklenmedi.</p>
        <Link href="/kariyer-yolu" className="mt-4 text-red-500 font-bold text-sm hover:underline">← Geri Dön</Link>
      </div>
    );
  }

  if (showStatsPage) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex flex-col p-6 text-white bg-slate-950 font-sans relative overflow-x-hidden justify-center">
        <div className="w-full bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl relative text-white text-center">
          <button onClick={() => setShowStatsPage(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">✕</button>
          <h3 className="font-bold text-lg mb-6 text-white">İstatistik</h3>
          <div className="flex justify-between mb-8 border-b border-slate-800 pb-6 text-center">
            <div className="flex-1 text-center">
              <div className="text-2xl font-bold">{stats.totalGames}</div>
              <div className="text-[8px] text-slate-500 font-semibold mt-1 leading-tight">Oynanan oyun</div>
            </div>
            <div className="flex-1 border-x border-slate-800 text-center">
              <div className="text-2xl font-bold text-green-500">{winPercentage}%</div>
              <div className="text-[8px] text-slate-500 font-semibold mt-1 leading-tight">Kazanma yüzdesi</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-2xl font-bold text-sky-500">{stats.wins}</div>
              <div className="text-[8px] text-slate-500 font-semibold mt-1 leading-tight">Toplam galibiyet</div>
            </div>
          </div>
          <div className="space-y-1.5 mb-8">
            {Object.entries(stats.distribution).map(([attempt, count]) => (
              <div key={attempt} className="flex items-center gap-3">
                <span className="text-[10px] font-bold w-4 text-slate-500 text-left">{attempt}</span>
                <div className="flex-grow bg-slate-950/50 h-5 rounded overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 flex items-center px-2 ${isWin && (attempt === finalAttempt.toString() || (attempt === "7+" && finalAttempt >= 7)) ? 'bg-red-600' : 'bg-slate-700'}`}
                    style={{ width: `${(count / maxDist) * 100 || 5}%` }}
                  >
                    <span className="text-[9px] font-bold text-white">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={shareScore} className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm active:scale-95 transition-all mb-3">
            {copySuccess ? "Kopyalandı!" : "Skoru Paylaş"}
          </button>
          <button onClick={() => setShowStatsPage(false)} className="w-full bg-slate-800 text-white py-3 rounded-xl text-xs font-semibold hover:bg-slate-700 transition-colors">
            Kapat
          </button>
        </div>

        {/* SEO bloğu — istatistik ekranı, koşulsuz */}
        <section className="mt-8 pt-6 border-t border-slate-900 pb-4">
          <h2 className="text-slate-600 text-xs tracking-[0.2em] uppercase mb-4">Kariyer Yolu hakkında</h2>
          <div className="space-y-3 text-slate-700 text-xs leading-relaxed font-light">
            <p>
              Kariyer Yolu, yolu Türkiye'den geçmiş futbolcuları sezon sezon açılan
              kariyer tablosundan tahmin ettiğin günlük bir bilgi yarışması oyunudur.
              Her tahminde yeni bir sezon görünür hale gelir; kariyer boyunca
              geçtiği kulüpleri, maç sayılarını ve gol istatistiklerini ipucu olarak
              kullanarak doğru oyuncuyu bulmaya çalışırsın.
            </p>
            <p>
              Oyun, Süper Lig'de oynamış yerli ve yabancı futbolcuları kapsar.
              Bazı sorularda yalnızca Türkiye'deki kariyeri değil, oyuncunun
              dünya genelindeki tüm kariyer yolculuğu tabloya yansır. Bu sayede
              bir oyuncunun hangi kulüplerden geçerek Süper Lig'e geldiğini ya
              da Türkiye'den hangi kulüplere transfer olduğunu keşfedebilirsin.
            </p>
            <p>
              İstatistik sayfasında kaçıncı tahminde bulduğunu gösteren dağılım
              grafiğini, kazanma yüzdeni ve toplam galibiyet sayını görebilirsin.
              Her gün yeni soru gelir. Arşiv navigasyonuyla geçmiş soruları da
              oynayabilirsin.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-4 text-white bg-slate-950 font-sans relative overflow-x-hidden">
      {isWin && <Confetti width={windowDimension.width} height={windowDimension.height} recycle={false} numberOfPieces={400} style={{ zIndex: 150 }} />}

      <div className="flex justify-between items-start mb-6 relative z-10">
        <Link href="/kariyer-yolu" className="text-slate-500 font-bold text-xs hover:text-white transition-colors pt-1">← Geri Dön</Link>
      </div>

      <div className="text-center mb-16 relative z-10">
        <div className="flex items-center justify-center gap-6 mb-2">
          <button onClick={() => loadQuestion(currentIndex - 1, gameQuestions)} disabled={currentIndex <= 0} className="text-slate-700 hover:text-red-600 disabled:opacity-0 font-bebas text-3xl transition-colors">‹</button>
          <h1 className="font-bebas text-3xl tracking-normal text-red-600 leading-none">Kariyer Yolu</h1>
          <button onClick={() => loadQuestion(currentIndex + 1, gameQuestions)} disabled={currentIndex >= gameQuestions.length - 1} className="text-slate-700 hover:text-red-600 disabled:opacity-0 font-bebas text-3xl transition-colors">›</button>
        </div>
        <span className="text-red-600 font-bebas text-2xl leading-none tracking-tighter">#{currentQ.id}</span>
      </div>

      <div className="w-full bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mb-6 relative z-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-[11px] text-slate-400 uppercase tracking-wider">
              <th className="px-4 py-3 font-semibold">Sezon</th>
              <th className="px-4 py-3 font-semibold">Takım</th>
              <th className="px-4 py-3 font-semibold text-center">Maç</th>
              <th className="px-4 py-3 font-semibold text-center">Gol</th>
            </tr>
          </thead>
          <tbody>
            {currentQ.career.map((step: any, index: number) => {
              const isVisible = index < visibleRows;
              const isEven = index % 2 === 0;
              return (
                <tr
                  key={index}
                  className={`border-t border-slate-800/40 transition-colors duration-500 ${isEven ? '' : 'bg-slate-900/30'}`}
                >
                  <td className="px-4 py-3 text-xs font-mono text-slate-400 tabular-nums">
                    {isVisible ? step.season : <span className="text-slate-700">····</span>}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-100">
                    {isVisible ? step.team : <span className="text-slate-700">····</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-xs font-mono text-slate-400 tabular-nums">
                    {isVisible ? step.apps : <span className="text-slate-700">··</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-xs font-mono text-slate-400 tabular-nums">
                    {isVisible ? `(${step.goals})` : <span className="text-slate-700">(··)</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-auto relative z-10 pb-6">
        {!isGameOver ? (
          <div className="relative font-sans">
            {suggestions.length > 0 && (
              <div className="absolute bottom-full w-full mb-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-50 shadow-2xl">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => handleGuess(s)} className={`w-full p-3.5 text-left border-b border-slate-700 last:border-0 font-semibold text-white text-sm ${selectedIndex === i ? "bg-red-600" : "hover:bg-red-600"}`}>
                    {toTitleCase(s)}
                  </button>
                ))}
              </div>
            )}
            <input
              value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Futbolcu ara..."
              className={`w-full p-4 bg-slate-900 rounded-2xl border-2 border-slate-800 focus:border-red-600 outline-none font-bold text-base text-white ${isError ? "border-red-600 animate-shake" : ""}`}
            />
            <div className="flex justify-end mt-3 px-1">
              <button onClick={() => handleGuess("pas")} className="text-amber-400 hover:text-amber-300 font-bold text-xs underline tracking-widest transition-colors">Pas Geç</button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-900 border-2 border-slate-800 rounded-2xl animate-in zoom-in duration-300 relative font-sans">
            <div className="flex items-center justify-between mb-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              <div className="text-left">
                <p className={`font-bebas text-xl leading-none mb-1 ${isWin ? 'text-green-500' : 'text-red-500'}`}>
                  {isWin ? 'Tebrikler!' : 'Maalesef!'}
                </p>
                <p className="font-bold text-lg text-white tracking-tight">{toTitleCase(currentQ.correctPlayer)}</p>
              </div>
              <button onClick={() => setShowStatsPage(true)} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-bold transition-colors">İstatistik</button>
            </div>
            <button onClick={shareScore} className="w-full bg-white text-black py-3 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all active:scale-95">
              {copySuccess ? "Kopyalandı!" : "Skoru Paylaş"}
            </button>
          </div>
        )}
      </div>

      {/* SEO içerik bloğu — koşulsuz, her zaman görünür */}
      <section className="mt-6 pt-6 border-t border-slate-900 pb-10">
        <h2 className="text-slate-600 text-xs tracking-[0.2em] uppercase mb-4">Kariyer Yolu hakkında</h2>
        <div className="space-y-3 text-slate-700 text-xs leading-relaxed font-light">
          <p>
            Kariyer Yolu, yolu Türkiye'den geçmiş futbolcuların kariyer geçmişlerini
            sezon sezon keşfettiğin günlük bir bilgi yarışması oyunudur. Her gün yeni
            bir futbolcunun kariyer tablosu önüne gelir; geçtiği takımları, maç
            sayılarını ve gol istatistiklerini inceleyerek doğru ismi tahmin etmeye
            çalışırsın.
          </p>
          <p>
            Oyunun temel mekaniği şu şekilde işler: başlangıçta kariyer tablosunun
            yalnızca ilk satırı görünürdür. Her yanlış tahminde bir sonraki sezon
            açılır ve yeni ipuçları elde edersin. Kariyer tablosu tamamen açıldıktan
            sonra da tahmin yapmaya devam edebilirsin. Ne kadar erken bulursan o kadar
            iyi bir skor elde edersin.
          </p>
          <p>
            Sorular Süper Lig'de iz bırakmış yerli ve yabancı futbolcuları kapsar.
            Bazı sorularda oyuncunun yalnızca Türkiye'deki dönemi değil, dünya
            genelindeki tüm kariyer yolculuğu tabloya yansır. Bu sayede hangi
            kulüplerden geçerek Süper Lig'e geldiğini ya da Türkiye'den sonra
            kariyerini nerede sürdürdüğünü keşfedebilirsin.
          </p>
          <p>
            Süper Lig'in farklı dönemlerinden isimler, genç yaşta Türk kulüplerinden
            Avrupa'ya açılan futbolcular ve dünyaca tanınan isimlerin Türkiye
            serüvenleri bu oyunun soru havuzunu oluşturur. Tanıdık bir kariyer
            silsilesi bile farklı bir perspektiften sorulduğunda zorlayıcı
            olabilir.
          </p>
          <p>
            İstatistik sayfasında kaçıncı tahminde bulduğunu gösteren dağılım
            grafiğini, toplam galibiyet sayını ve kazanma yüzdeni takip
            edebilirsin. Arşiv navigasyonuyla geçmiş soruları tekrar oynayabilir,
            kaçırdığın günleri tamamlayabilirsin. Sorular her gün yenilenir.
          </p>
        </div>
      </section>

    </div>
  );
}