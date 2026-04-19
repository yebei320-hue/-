import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, MapPin, Skull, ShieldCheck, ChevronRight, Lock, Flame } from "lucide-react";
import { PUZZLES, Puzzle } from "./constants";
import PuzzleInterface from "./components/PuzzleInterface";

type PageType = "COVER" | "PREFACE" | "MAP" | "PUZZLE" | "SUMMARY" | "CH1_TRANSITION";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("COVER");
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [solvedPuzzles, setSolvedPuzzles] = useState<number[]>([]);

  const currentPuzzle = PUZZLES[currentPuzzleIndex];

  const nextPage = () => {
    if (currentPage === "COVER") setCurrentPage("PREFACE");
    else if (currentPage === "PREFACE") setCurrentPage("MAP");
    else if (currentPage === "SUMMARY") {
      if (currentPuzzleIndex < PUZZLES.length - 1) {
        setCurrentPage("MAP");
      } else {
        setCurrentPage("CH1_TRANSITION");
      }
    }
  };

  const selectPuzzle = (index: number) => {
    // Only allow sequential selection
    if (index === solvedPuzzles.length) {
      setCurrentPuzzleIndex(index);
      setCurrentPage("PUZZLE");
    }
  };

  const handleSolve = () => {
    if (!solvedPuzzles.includes(currentPuzzleIndex)) {
      setSolvedPuzzles([...solvedPuzzles, currentPuzzleIndex]);
    }
    setCurrentPage("SUMMARY");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] blood-splatter blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className={`relative w-full ${
          currentPage === "COVER" 
            ? "max-w-md aspect-[0.75/1]" 
            : "max-w-6xl md:aspect-[1.4/1] md:h-auto h-[90vh] md:book-crease"
        } bg-parchment parchment-texture book-shadow rounded-sm flex flex-col md:flex-row overflow-hidden border border-black/10 transition-all duration-700`}
      >
        {/* Left Page - Hidden on Cover */}
        {currentPage !== "COVER" && (
          <div className="flex-1 border-b md:border-b-0 md:border-r border-black/5 relative overflow-y-auto scrollbar-hide min-h-[40vh] md:min-h-0">
            <AnimatePresence mode="wait">
              {currentPage === "PREFACE" && (
                <motion.div
                  key="preface-left"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="h-full p-12 flex flex-col justify-center"
                >
                  <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-blood mb-8 font-serif">序言 (Preface)</h2>
                  <div className="space-y-6 text-lg leading-relaxed italic opacity-80 font-serif">
                    <p>“一个幽灵，共产主义的幽灵，在欧洲游荡。”</p>
                    <p>“这本在 1848 年伦敦诞生的册子，起初只是少数人的纲领。但在接下来的四十年里，它随着资本的扩张流转于柏林、莫斯科、伦敦与纽约。”</p>
                  </div>
                </motion.div>
              )}

              {(currentPage === "MAP" || currentPage === "PUZZLE" || currentPage === "SUMMARY") && (
                <motion.div
                  key="visual-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full relative"
                >
                  {currentPage === "MAP" ? (
                    <div className="h-full p-8 sm:p-12 flex flex-col">
                      <div className="mb-8 flex items-center gap-4">
                        <div className="h-px bg-blood/30 flex-1" />
                        <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-blood font-serif">
                          序言历史航图
                        </h2>
                        <div className="h-px bg-blood/30 flex-1" />
                      </div>
                      
                      <div className="flex-1 border border-black/10 relative overflow-hidden rounded-sm bg-black/[0.03] shadow-inner mb-6">
                        <div className="absolute inset-0 opacity-15 grayscale sepia bg-[url('https://picsum.photos/seed/vintage-map/800/600')] bg-cover" />
                        
                        {/* Connecting Path */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <motion.polyline
                            points={PUZZLES.map((_, i) => {
                              const x = 20 + (i * 10);
                              const y = 20 + Math.sin(i * 1.2) * 25 + 25;
                              return `${x + 1.75},${y + 1.75}`;
                            }).join(' ')}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            strokeDasharray="1 1"
                            className="text-blood"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2 }}
                          />
                        </svg>

                        {PUZZLES.map((p, i) => (
                          <button
                            key={i}
                            onClick={() => selectPuzzle(i)}
                            disabled={i > solvedPuzzles.length}
                            className={`absolute group transition-all transform hover:scale-110 ${i > solvedPuzzles.length ? 'cursor-not-allowed opacity-20' : 'cursor-pointer opacity-100'}`}
                            style={{
                              left: `${20 + (i * 10)}%`,
                              top: `${20 + Math.sin(i * 1.2) * 25 + 25}%`,
                            }}
                          >
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${solvedPuzzles.includes(i) ? 'bg-gold ring-4 ring-gold/10 scale-125' : 'bg-blood'} ${i === solvedPuzzles.length ? 'animate-pulse ring-8 ring-blood/5 shadow-[0_0_10px_rgba(153,27,27,0.3)]' : ''}`}>
                              {solvedPuzzles.includes(i) && <ShieldCheck size={8} className="text-white" />}
                            </div>
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-2 py-0.5 border border-black/10 z-50 rounded">
                              {p.year}
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      <div className="text-[10px] text-center opacity-40 font-serif italic tracking-wide">
                        历史的航道并非坦途，每一处火光皆是一次觉醒。
                      </div>
                    </div>
                  ) : (
                    <div className="h-full p-8 flex flex-col">
                      <div className="h-2/3 bg-black/10 rounded-lg overflow-hidden border border-black/10 relative group mb-6">
                        <img 
                          src={`https://picsum.photos/seed/manifesto-${currentPuzzle.year}/800/800`} 
                          className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 scale-105 group-hover:scale-100 transition-transform duration-700" 
                          alt="visual"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-parchment text-[10px] font-mono opacity-60 uppercase tracking-widest">Act {currentPuzzleIndex + 1}: {currentPuzzle.year}</p>
                          <h3 className="text-parchment text-xl font-bold font-serif">{currentPuzzle.title}</h3>
                        </div>
                      </div>
                      <div className="flex-1 text-xl leading-relaxed opacity-80 border-l-2 border-blood pl-6 italic font-serif flex items-center">
                        “{currentPuzzle.scenario}”
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {currentPage === "CH1_TRANSITION" && (
                <motion.div
                  key="ch1-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full p-12 flex flex-col justify-center items-center text-center relative"
                >
                  <div className="absolute inset-0 grayscale opacity-10 bg-[url('https://picsum.photos/seed/battlefield/800/800')] bg-cover" />
                  <div className="z-10 group cursor-default">
                    <Flame size={64} className="text-blood animate-pulse group-hover:scale-110 transition-transform" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-blood mt-12 z-10 transition-colors">序言已尽 迷雾已散</h2>
                  <div className="mt-8 space-y-4 text-[11px] leading-relaxed opacity-60 z-10 font-serif italic">
                    <p>你已穿过了四十年的风暴，看清了幽灵留下的轨迹。</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Right Page (or Full Cover) */}
        <div className={`${currentPage === "COVER" ? "w-full" : "flex-1"} relative overflow-y-auto scrollbar-hide transition-all duration-700`}>
          <AnimatePresence mode="wait">
            {currentPage === "COVER" && (
              <motion.div
                key="cover-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-between p-4 sm:p-8 text-center relative overflow-y-auto scrollbar-hide"
              >
                {/* Decorative Borders */}
                <div className="absolute inset-3 border border-black/5 pointer-events-none" />
                <div className="absolute inset-4 border border-black/10 pointer-events-none" />
                
                {/* Corner Ornaments */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-black/20 pointer-events-none" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-black/20 pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-black/20 pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-black/20 pointer-events-none" />

                <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 py-6">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-full flex flex-col items-center"
                  >
                    <div className="flex items-center gap-3 mb-6 opacity-30">
                      <div className="w-8 h-px bg-black" />
                      <div className="w-1.5 h-1.5 rotate-45 border border-black" />
                      <div className="w-8 h-px bg-black" />
                    </div>
                    
                    <motion.h1 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-4xl sm:text-5xl font-graffiti tracking-tighter text-black leading-none drop-shadow-sm mb-4"
                    >
                      共产党宣言
                    </motion.h1>
                    
                    <motion.p 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-[10px] font-serif font-black tracking-[0.4em] opacity-80 border-y border-black/10 py-1.5 px-4 mb-6 uppercase"
                    >
                      THE COMMUNIST MANIFESTO
                    </motion.p>

                    <div className="flex items-center gap-3 mt-2 opacity-30">
                      <div className="w-8 h-px bg-black" />
                      <div className="w-1.5 h-1.5 rotate-45 border border-black" />
                      <div className="w-8 h-px bg-black" />
                    </div>
                  </motion.div>
                </div>
                
                <div className="mt-auto mb-4 flex flex-col items-center space-y-8 z-20">
                  <div className="space-y-1.5 text-center">
                    <p className="text-[7px] uppercase tracking-[0.4em] font-bold opacity-30">Written by</p>
                    <p className="text-xs font-serif italic text-black/60 tracking-wide">Karl Marx & Friedrich Engels</p>
                  </div>

                  <button 
                    onClick={nextPage}
                    className="group relative px-12 py-3.5 overflow-hidden outline-none bg-parchment/50 backdrop-blur-md z-30 shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="absolute inset-0 border border-black/40 group-hover:border-blood transition-colors" />
                    <div className="relative text-blood font-black uppercase tracking-[0.5em] text-[11px] group-hover:scale-105 transition-transform">
                      START GAME
                    </div>
                  </button>
                </div>

                {/* Wax Seal Detail - Moved to bottom right corner relative position */}
                <div className="absolute bottom-4 right-4 opacity-20 grayscale group hover:grayscale-0 transition-all z-10 pointer-events-none">
                   <div className="w-8 h-8 wax-seal rounded-full flex items-center justify-center shadow-lg transform -rotate-12">
                      <Flame size={12} className="text-white/40" />
                   </div>
                </div>
              </motion.div>
            )}

            {currentPage === "PREFACE" && (
              <motion.div
                key="preface-right"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="h-full p-8 sm:p-12 flex flex-col justify-center text-center"
              >
                <div className="max-w-md mx-auto space-y-8">
                  <div className="space-y-6 text-base sm:text-lg leading-relaxed italic opacity-80 font-serif">
                    <p>“马克思与恩格斯为它先后撰写了七篇序言，每一篇都是它在不同国家、不同时刻战斗过的注脚。”</p>
                    <p>“翻开这些序言，你会看到那些被掩盖在统计数据下的真实命运。当所有序言的谜题解开，你将踏入正文的第一个章节。”</p>
                  </div>
                  <div className="h-px bg-black/10 w-24 mx-auto" />
                  <p className="text-blood font-bold text-sm tracking-widest uppercase">
                    请握好你的羽毛笔，从接下来的汤面中，寻找那条通往真相的红线。
                  </p>
                  <button 
                    onClick={nextPage}
                    className="mt-8 mx-auto flex items-center gap-3 text-blood font-bold uppercase tracking-[0.4em] text-xs hover:gap-5 transition-all"
                  >
                    开始见证 <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {currentPage === "MAP" && (
              <motion.div
                key="map-right"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full p-8 sm:p-12 flex flex-col justify-center text-center"
              >
                <div className="max-w-md mx-auto space-y-10">
                  <div className="w-12 h-1 bg-blood/20 mx-auto" />
                  <p className="text-xl sm:text-2xl leading-relaxed italic opacity-80 font-serif px-4">
                    “真理并不是在真空中诞生的，它在不同的年份、不同的土地上，以鲜血和汗水为墨。”
                  </p>
                  <div className="space-y-4">
                    <div className="h-px bg-black/10 w-24 mx-auto" />
                    <p className="text-[10px] opacity-60 font-sans uppercase tracking-[0.3em] font-bold">
                      [ 请遵循历史轨迹 开启红色火花 ]
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {currentPage === "PUZZLE" && (
              <motion.div
                key="puzzle-right"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full"
              >
                 <PuzzleInterface 
                  puzzle={currentPuzzle} 
                  onSolve={handleSolve}
                  onGiveUp={handleSolve}
                 />
              </motion.div>
            )}

            {currentPage === "SUMMARY" && (
              <motion.div
                key="summary-right"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full p-8 sm:p-12 flex flex-col overflow-y-auto scrollbar-hide"
              >
                <div className="mb-10 text-center">
                  <div className="inline-flex items-center gap-2 bg-blood/10 text-blood px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] mb-4">
                    <ShieldCheck size={14} /> 历 史 的 回 响
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold italic text-black font-serif tracking-tight">
                    {currentPuzzle.year} 序言之真相
                  </h2>
                </div>

                <div className="flex-1 space-y-10 font-serif max-w-lg mx-auto w-full text-left">
                  <div className="grid gap-8">
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold text-black/40 font-sans">
                        <div className="w-4 h-px bg-black/20" /> 汤 底 · 历 史 原 貌
                      </h4>
                      <p className="text-sm leading-relaxed text-black/80 pl-6 border-l border-black/5">
                        {currentPuzzle.secretTruth}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold text-black/40 font-sans">
                        <div className="w-4 h-px bg-black/20" /> 核 心 思 想
                      </h4>
                      <p className="text-sm leading-relaxed italic text-black/80 pl-6 border-l border-black/5">
                        {currentPuzzle.summary.coreIdea}
                      </p>
                    </div>

                    <div className="mt-4 p-6 bg-black/[0.02] border border-black/5 rounded-sm relative">
                      <div className="absolute top-0 right-4 -translate-y-1/2 bg-parchment px-2 text-blood">
                        <Flame size={16} />
                      </div>
                      <p className="text-xl sm:text-2xl font-bold italic text-blood leading-snug text-center font-graffiti opacity-90">
                        “{currentPuzzle.summary.famousQuote}”
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-black/5 flex justify-center">
                  <button 
                    onClick={nextPage}
                    className="flex items-center gap-3 bg-blood text-parchment py-3 px-10 rounded-sm font-bold uppercase tracking-[0.3em] text-xs hover:shadow-lg transition-all active:scale-95"
                  >
                    {currentPuzzleIndex < PUZZLES.length - 1 ? "翻向下一篇序言" : "开启正文全卷"} <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

              {currentPage === "CH1_TRANSITION" && (
                <motion.div
                  key="ch1-right"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full p-8 sm:p-12 flex flex-col justify-center overflow-y-auto scrollbar-hide text-center"
                >
                  <div className="max-w-md mx-auto space-y-10 font-serif">
                    <div className="space-y-6 italic text-lg leading-relaxed text-black/80 px-4">
                      <div className="w-12 h-0.5 bg-blood/20 mx-auto mb-6" />
                      <p>“接下来，请屏住呼吸。你将进入真正的战场。这里不再有谜题，只有最锐利的真理。”</p>
                    </div>
                    
                    <div className="py-10 bg-black/[0.03] border-y border-black/5 relative px-6">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-parchment px-4">
                        <BookOpen size={24} className="text-blood opacity-60" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-display font-bold text-black mb-4 tracking-tight">一、资产者和无产者</h2>
                      <p className="text-lg sm:text-xl italic text-blood font-bold tracking-tight opacity-90">
                        “至今一切社会的历史都是阶级斗争的历史。”
                      </p>
                    </div>

                    <div className="space-y-6">
                      <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">
                        [ 待解锁：正文第一章 · 宣言原典 ]
                      </p>
                      
                      <button 
                        onClick={() => {
                          setSolvedPuzzles([]);
                          setCurrentPuzzleIndex(0);
                          setCurrentPage("COVER");
                        }}
                        className="text-[10px] uppercase tracking-widest font-bold text-black/50 hover:text-blood hover:opacity-100 transition-all border-b border-black/10 pb-1"
                      >
                        重新开启见证之旅
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
          </AnimatePresence>
        </div>

        {/* Book Spine Detail - Only show when NOT on Cover and on Desktop */}
        {currentPage !== "COVER" && (
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-black/10 shadow-[0_0_10px_rgba(0,0,0,0.2)] hidden md:block" />
        )}
      </motion.div>

      {/* Footer Meta */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 text-[10px] uppercase tracking-[0.3em] font-bold opacity-20 pointer-events-none">
        <span>History</span>
        <div className="w-1 h-1 rounded-full bg-black" />
        <span>Theory</span>
        <div className="w-1 h-1 rounded-full bg-black" />
        <span>Witness</span>
      </div>
    </div>
  );
}

