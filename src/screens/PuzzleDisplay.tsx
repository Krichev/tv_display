import React from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePuzzleSpectator } from '../hooks/usePuzzleSpectator';
import { ConnectionOverlay } from '../components/ConnectionOverlay';
import { PuzzleLobbyScreen } from './PuzzleLobbyScreen';
import { PuzzleDistributingScreen } from './PuzzleDistributingScreen';
import { PuzzleBoardScreen } from './PuzzleBoardScreen';
import { PuzzleRevealScreen } from './PuzzleRevealScreen';

export const PuzzleDisplay: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const { 
    connectionStatus, 
    state, 
    players, 
    pieces, 
    recentEvents, 
    completedData, 
    timeLeft 
  } = usePuzzleSpectator(roomCode || '');

  if (!roomCode) return <div className="text-white text-center p-20 text-4xl">Invalid Room Code</div>;

  const renderPhase = () => {
    if (!state) return null;

    if (completedData) {
      return <PuzzleRevealScreen key="reveal" data={completedData} />;
    }

    switch (state.phase) {
      case 'CREATED':
        return <PuzzleLobbyScreen key="lobby" state={state} players={players} />;
      case 'DISTRIBUTING':
        return <PuzzleDistributingScreen key="distributing" />;
      case 'IN_PROGRESS':
      case 'GUESSING':
        return (
          <PuzzleBoardScreen 
            key="board"
            state={state} 
            players={players} 
            pieces={pieces} 
            recentEvents={recentEvents}
            timeLeft={timeLeft}
          />
        );
      case 'ABANDONED':
        return (
          <div key="abandoned" className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
            <h1 className="text-6xl font-black mb-8">GAME ABANDONED</h1>
            <button onClick={() => window.location.href = '/'} className="px-8 py-4 bg-white text-black font-bold rounded-full">Back to Home</button>
          </div>
        );
      default:
        return <div key="default" className="text-white">Waiting for state...</div>;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none">
      <ConnectionOverlay status={connectionStatus} />
      
      <AnimatePresence mode="wait">
        {renderPhase()}
      </AnimatePresence>
    </div>
  );
};
