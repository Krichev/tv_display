import React from 'react';
import { motion } from 'framer-motion';

export const PuzzleDistributingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center">
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="text-9xl mb-12"
      >
        ✂️
      </motion.div>

      <div className="relative w-64 h-64 mb-12">
        {/* Animated Grid Lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <motion.path
            d="M 33.3 0 V 100 M 66.6 0 V 100 M 0 33.3 H 100 M 0 66.6 H 100"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            strokeDasharray="4 2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
        
        {/* Pulsing Cells */}
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-1">
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.1 }}
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{ delay: i * 0.1, duration: 1.5, repeat: Infinity }}
              className="bg-blue-500 rounded-sm"
            />
          ))}
        </div>
      </div>

      <h2 className="text-4xl font-bold tracking-widest uppercase">
        Cutting Puzzle Pieces
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >.</motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
        >.</motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
        >.</motion.span>
      </h2>
      <p className="text-xl text-gray-400 mt-4">Preparing the collaborative challenge...</p>
    </div>
  );
};
