import React from 'react';
import { GameContextType } from '../types/game';
import { motion } from 'framer-motion';

interface LeaderboardScreenProps {
  gameContext: GameContextType;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ gameContext }) => {
  const { players } = gameContext;
  
  const sortedPlayers = [...players]
    .filter(p => p.role !== 'PRESENTER')
    .sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col h-screen w-screen bg-brand-dark p-12">
      <h1 className="text-8xl font-black text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-brand-highlight to-purple-500">
        LEADERBOARD
      </h1>

      <div className="max-w-6xl mx-auto w-full flex flex-col gap-4">
        {sortedPlayers.map((player, index) => (
          <motion.div
            key={player.userId}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`
                flex items-center justify-between p-8 rounded-2xl shadow-xl
                ${index === 0 ? 'bg-yellow-500 text-black transform scale-105 z-10' : ''}
                ${index === 1 ? 'bg-gray-300 text-black' : ''}
                ${index === 2 ? 'bg-amber-700 text-white' : ''}
                ${index > 2 ? 'bg-white/10 text-white' : ''}
            `}
          >
             <div className="flex items-center gap-8">
                 <div className="text-5xl font-black w-20">#{index + 1}</div>
                 <div className="text-5xl font-bold">{player.username}</div>
             </div>
             <div className="text-6xl font-black">{player.score}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
