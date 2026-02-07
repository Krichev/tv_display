import React from 'react';
import { RoomPlayer, PlayerRole } from '../types/game';
import { cn } from '../utils/cn';
import { CheckCircle, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlayerGridProps {
  players: RoomPlayer[];
  showScore?: boolean;
  className?: string;
}

export const PlayerGrid: React.FC<PlayerGridProps> = ({ players, showScore, className }) => {
  // Filter out presenter from grid usually
  const gamePlayers = players.filter(p => p.role !== PlayerRole.PRESENTER);

  return (
    <div className={cn("grid grid-cols-4 gap-6 p-8", className)}>
      {gamePlayers.map((player) => (
        <motion.div
            key={player.userId}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
                "bg-brand-light rounded-xl p-6 flex flex-col items-center justify-center relative shadow-lg border-2",
                player.connected ? "border-brand-accent" : "border-gray-600 opacity-50",
                player.lastAnswer ? "border-brand-highlight bg-brand-accent/30" : ""
            )}
        >
          <div className="relative">
            <div className="w-24 h-24 bg-brand-accent rounded-full flex items-center justify-center mb-4 text-4xl font-bold text-white/80">
                {player.avatarUrl ? <img src={player.avatarUrl} className="w-full h-full rounded-full" /> : player.username.charAt(0).toUpperCase()}
            </div>
            {player.lastAnswer && (
                <div className="absolute -top-2 -right-2 bg-brand-highlight text-white p-2 rounded-full shadow-lg">
                    <CheckCircle size={24} />
                </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            {player.role === PlayerRole.HOST && <Crown size={20} className="text-yellow-400" />}
            <span className="text-2xl font-semibold truncate max-w-[200px]">{player.username}</span>
          </div>

          {showScore && (
            <div className="text-3xl font-bold text-brand-highlight">
                {player.score} pts
            </div>
          )}
          
          {!player.connected && <span className="text-red-400 text-sm mt-2">Disconnected</span>}
        </motion.div>
      ))}
    </div>
  );
};
