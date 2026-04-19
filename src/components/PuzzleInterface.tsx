import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, ChevronRight, X, AlertCircle } from "lucide-react";
import { Puzzle } from "../constants";
import { askQuestion } from "../services/geminiService";

interface PuzzleInterfaceProps {
  puzzle: Puzzle;
  onSolve: () => void;
  onGiveUp: () => void;
}

export default function PuzzleInterface({ puzzle, onSolve, onGiveUp }: PuzzleInterfaceProps) {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<{ question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const q = question.trim();
    setQuestion("");
    setLoading(true);

    try {
      const response = await askQuestion(puzzle, history, q);
      
      if (typeof response === "string") {
        setHistory(prev => [...prev, { question: q, answer: response }]);
        setLoading(false);
        return;
      }

      // Add a placeholder entry
      setHistory(prev => [...prev, { question: q, answer: "" }]);
      
      let fullAnswer = "";
      for await (const chunk of response) {
        const text = chunk.text;
        if (text) {
          fullAnswer += text;
          setHistory(prev => {
            const next = [...prev];
            if (next.length > 0) {
              next[next.length - 1] = { ...next[next.length - 1], answer: fullAnswer };
            }
            return next;
          });
        }
      }
    } catch (error) {
      console.error("Submit Error:", error);
      setHistory(prev => [...prev, { question: q, answer: "与此无关 (幽灵迷失了路径)" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full font-serif">
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide" ref={scrollRef}>
        <div className="space-y-8">
          <AnimatePresence>
            {history.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid gap-3"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 text-[9px] uppercase tracking-tighter font-bold opacity-30 mt-1 shrink-0">Witness</div>
                  <div className="flex-1 text-sm italic leading-relaxed text-black/70 py-1">
                    {item.question}
                  </div>
                </div>
                <div className="flex items-start gap-4 border-l-2 border-blood/20 pl-4 py-1 ml-10 translate-y-[-4px]">
                  <div className="w-10 text-[9px] uppercase tracking-tighter font-bold text-blood opacity-60 mt-1 shrink-0">Ghost</div>
                  <div className="flex-1 text-[11px] font-medium tracking-wider text-blood leading-relaxed">
                    <span className="font-black border-b border-blood/30 mr-2">{item.answer.split(/[。！？，,]/)[0]}</span>
                    <span className="italic opacity-90">{item.answer.includes('。') || item.answer.includes('！') || item.answer.includes('？') || item.answer.includes('，') || item.answer.includes(',') ? item.answer.substring(item.answer.search(/[。！？，,]/)) : ''}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 ml-14"
            >
              <div className="bg-blood/10 px-3 py-1.5 rounded text-[10px] animate-pulse text-blood font-bold tracking-widest uppercase italic">
                幽灵审视中...
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-black/10 bg-black/5">
        <form onSubmit={handleSubmit} className="relative flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="提出你的见证..."
            className="w-full bg-white/50 border border-black/10 rounded-full px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blood/30 font-serif italic"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blood text-parchment p-2 rounded-full hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>

        <div className="flex gap-4 mt-4 justify-center">
          <button
            onClick={onSolve}
            className="text-[10px] uppercase tracking-widest flex items-center gap-1 hover:text-blood transition-colors font-bold"
          >
            <ChevronRight size={12} /> 我已看穿真相
          </button>
          <button
            onClick={onGiveUp}
            className="text-[10px] uppercase tracking-widest flex items-center gap-1 hover:text-blood transition-colors font-bold opacity-60"
          >
            <X size={12} /> 彻底放弃
          </button>
        </div>
      </div>
    </div>
  );
}
