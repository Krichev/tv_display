import React from 'react';
import { GameContextType } from '../types/game';
import { motion } from 'framer-motion';

interface AnswerRevealScreenProps {
  gameContext: GameContextType;
}

export const AnswerRevealScreen: React.FC<AnswerRevealScreenProps> = ({ gameContext }) => {
  const { currentQuestion } = gameContext;

  // Assuming backend broadcasts who was correct or we deduce it
  // Since we don't have per-player correctness in RoomPlayer interface yet (I missed adding it explicitly in my thought process but backend might send it),
  // I'll stick to displaying the correct answer.
  // Actually, RoomPlayer has `score`. Changes in score = correct. 
  // But for now, just show the answer.
  
  return (
    <div className="flex flex-col h-screen w-screen bg-brand-dark p-12 items-center justify-center">
       <h2 className="text-4xl text-gray-400 mb-8 uppercase tracking-widest">Correct Answer</h2>
       
       <motion.div 
         initial={{ scale: 0 }}
         animate={{ scale: 1 }}
         className="bg-green-500 text-white text-8xl font-black p-12 rounded-3xl shadow-2xl text-center"
       >
          {currentQuestion?.correctAnswer || "Check your device!"}
       </motion.div>
    </div>
  );
};
