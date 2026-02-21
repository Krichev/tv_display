import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PuzzleCompletedMessage } from '../types/puzzle';

interface PuzzleRevealScreenProps {
  data: PuzzleCompletedMessage;
}

type RevealStage = 'DRUMROLL' | 'IMAGE' | 'ANSWER' | 'LEADERBOARD';

export const PuzzleRevealScreen: React.FC<PuzzleRevealScreenProps> = ({ data }) => {
  const [stage, setStage] = useState<RevealStage>('DRUMROLL');

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage('IMAGE'), 2500),
      setTimeout(() => setStage('ANSWER'), 5500),
      setTimeout(() => setStage('LEADERBOARD'), 8000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-12 overflow-hidden">
      <AnimatePresence mode="wait">
        {stage === 'DRUMROLL' && (
          <motion.div
            key="drumroll"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="text-center"
          >
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-9xl mb-8"
            >
              🎉
            </motion.div>
            <h1 className="text-8xl font-black italic tracking-tighter mb-4">PUZZLE COMPLETE!</h1>
            <p className="text-3xl text-blue-400 font-bold uppercase tracking-widest animate-pulse">Revealing the hidden image...</p>
          </motion.div>
        )}

        {stage === 'IMAGE' && (
          <motion.div
            key="image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="relative"
          >
            <motion.div
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              animate={{ clipPath: 'inset(0% 0 0 0)' }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="rounded-[3rem] border-8 border-white/10 shadow-2xl overflow-hidden"
            >
              <img src={data.sourceImageUrl} className="w-[800px] h-[800px] object-cover" alt="Revealed" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, delay: 1.5 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            />
          </motion.div>
        )}

        {stage === 'ANSWER' && (
          <motion.div
            key="answer"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="text-center"
          >
            <p className="text-3xl text-gray-400 font-bold uppercase tracking-[1em] mb-12">The answer was</p>
            <h2 className="text-[12rem] font-black leading-none bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent italic tracking-tighter drop-shadow-2xl">
              {data.correctAnswer.toUpperCase()}
            </h2>
          </motion.div>
        )}

        {stage === 'LEADERBOARD' && (
          <motion.div
            key="leaderboard"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-5xl"
          >
            <h2 className="text-5xl font-black italic mb-12 text-center text-blue-400 uppercase tracking-tighter">Hall of Fame</h2>
            <div className="space-y-4">
              {data.leaderboard.map((res, i) => (
                <motion.div
                  key={res.username}
                  initial={{ x: i % 2 === 0 ? -100 : 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 + 0.5, type: 'spring' }}
                  className={`p-6 rounded-3xl flex items-center gap-8 border-2 shadow-xl ${
                    i === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50' : 
                    i === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50' :
                    i === 2 ? 'bg-gradient-to-r from-orange-700/20 to-orange-800/20 border-orange-700/50' :
                    'bg-gray-800/40 border-white/5'
                  }`}
                >
                  <div className="text-5xl font-black w-24 text-center">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </div>
                  <div className="flex-1">
                    <p className="text-3xl font-bold">{res.username}</p>
                    <div className="flex gap-6 mt-2 text-gray-400 font-bold uppercase text-sm tracking-wider">
                      <span>{res.piecesPlacedCorrectly} pieces</span>
                      <span>{res.totalMoves} moves</span>
                      <span>{res.completionTimeMs ? `${(res.completionTimeMs/1000).toFixed(1)}s` : '---'}</span>
                    </div>
                  </div>
                  <div className="text-5xl font-mono font-black text-white/80">
                    {res.score}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              className="mt-16 flex justify-center"
            >
              <button 
                onClick={() => window.location.href = '/'}
                className="px-12 py-6 bg-white text-black font-black text-2xl rounded-full hover:scale-110 transition-transform shadow-2xl uppercase tracking-widest"
              >
                Back to Lobby
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
