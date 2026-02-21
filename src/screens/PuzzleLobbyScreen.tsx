import React from 'react';
import { motion } from 'framer-motion';
import { PuzzleStateMessage, PlayerBoardSnapshot } from '../types/puzzle';
import { RoomQRCode } from '../components/RoomQRCode';

interface PuzzleLobbyScreenProps {
  state: PuzzleStateMessage;
  players: PlayerBoardSnapshot[];
}

export const PuzzleLobbyScreen: React.FC<PuzzleLobbyScreenProps> = ({ state, players }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-12 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] text-9xl">🧩</div>
        <div className="absolute bottom-[-10%] right-[-10%] text-9xl">🧩</div>
        <div className="absolute top-[20%] right-[15%] text-7xl rotate-12">🖼️</div>
      </div>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
        <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent italic tracking-tighter">
          PICTURE PUZZLE
        </h1>
        <div className="flex gap-4 justify-center">
          <span className="px-6 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 font-bold">
            {state.gameMode} MODE
          </span>
          <span className="px-6 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 font-bold">
            {state.gridRows}x{state.gridCols} GRID
          </span>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row items-center gap-24 z-10">
        <div className="flex flex-col items-center">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl mb-8">
            <RoomQRCode roomCode={state.roomCode} size={300} />
          </div>
          <div className="text-center">
            <p className="text-2xl text-gray-400 mb-2 font-medium">Join at <span className="text-white font-bold">challenger.app</span></p>
            <div className="flex gap-3 justify-center">
              {state.roomCode.split('').map((char, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1), type: 'spring' }}
                  className="w-16 h-20 bg-gray-800 rounded-2xl flex items-center justify-center text-4xl font-black border-b-4 border-black"
                >
                  {char}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-[500px]">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-3xl font-bold">Players Joined</h2>
            <span className="text-xl text-blue-400 font-mono">{players.length} ready</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {players.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-gray-500 italic text-xl border-2 border-dashed border-gray-800 rounded-3xl">
                Waiting for the first player...
              </div>
            ) : (
              players.map((player, i) => (
                <motion.div
                  key={player.userId}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-800/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold">
                    {player.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xl font-semibold truncate">{player.username}</span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
