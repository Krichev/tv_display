import React from 'react';
import { GameContextType, GamePhase } from '../types/game';
import { PlayerGrid } from '../components/PlayerGrid';
import { motion } from 'framer-motion';

interface QuestionScreenProps {
  gameContext: GameContextType;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({ gameContext }) => {
  const { currentQuestion, timeLeft, players, gameState } = gameContext;

  if (!currentQuestion) {
      return <div className="flex items-center justify-center h-screen text-4xl">Loading Question...</div>;
  }

  const isAnswering = gameState.phase === GamePhase.ANSWERING;
  
  return (
    <div className="flex flex-col h-screen w-screen bg-brand-dark p-8 relative">
      {/* Timer Bar */}
      <div className="h-4 w-full bg-gray-800 rounded-full mb-8 overflow-hidden">
        <motion.div 
            className="h-full bg-brand-highlight"
            initial={{ width: '100%' }}
            animate={{ width: isAnswering ? '0%' : '100%' }}
            transition={{ duration: timeLeft, ease: "linear" }}
        />
      </div>

      <div className="flex flex-1 gap-8">
          {/* Question Content */}
          <div className="flex-1 flex flex-col">
              <div className="bg-white/10 rounded-3xl p-12 mb-8 flex-1 flex flex-col items-center justify-center text-center">
                  {currentQuestion.mediaUrl && (
                      <div className="mb-8 max-h-[40vh] overflow-hidden rounded-xl">
                          {currentQuestion.mediaType === 'VIDEO' ? (
                              <video src={currentQuestion.mediaUrl} controls autoPlay className="max-h-full" />
                          ) : (
                              <img src={currentQuestion.mediaUrl} alt="Question Media" className="max-h-full object-contain" />
                          )}
                      </div>
                  )}
                  <h1 className="text-6xl font-bold leading-tight">{currentQuestion.text}</h1>
              </div>

              {/* Options if available */}
               {currentQuestion.options && currentQuestion.options.length > 0 && (
                   <div className="grid grid-cols-2 gap-4 h-[30vh]">
                       {currentQuestion.options.map((opt, idx) => (
                           <div key={idx} className="bg-brand-accent rounded-xl flex items-center justify-center p-6 text-3xl font-semibold">
                               {opt}
                           </div>
                       ))}
                   </div>
               )}
          </div>

          {/* Sidebar: Players Status */}
          <div className="w-1/4 bg-white/5 rounded-3xl p-6 flex flex-col">
               <h2 className="text-2xl font-bold mb-6 text-center">
                   {players.filter(p => p.lastAnswer).length} / {players.filter(p => p.role !== 'PRESENTER').length} Answered
               </h2>
               <div className="flex-1 overflow-y-auto">
                   <PlayerGrid players={players} className="grid-cols-2 gap-3 p-0" />
               </div>
          </div>
      </div>
      
       <div className="absolute top-12 right-12 text-6xl font-black text-brand-highlight bg-white/10 w-32 h-32 rounded-full flex items-center justify-center border-4 border-brand-highlight">
            {timeLeft}
       </div>
    </div>
  );
};
