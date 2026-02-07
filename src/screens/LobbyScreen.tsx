import React from 'react';
import { GameContextType } from '../types/game';
import { PlayerGrid } from '../components/PlayerGrid';
import { RoomQRCode } from '../components/RoomQRCode';

interface LobbyScreenProps {
  gameContext: GameContextType;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({ gameContext }) => {
  const { roomCode, players, connectionStatus, gameState } = gameContext;
  
  // Use joinUrl from gameState if backend provides it, otherwise fallback
  const joinUrl = (gameState as any).joinUrl || `${window.location.origin.replace('5173', '3000')}/join/${roomCode}`;

  return (
    <div className="flex flex-col h-screen w-screen bg-brand-dark p-12">
      <header className="flex justify-between items-center mb-12">
        <div>
           <h1 className="text-4xl font-light text-gray-400">Join at</h1>
           <div className="text-6xl text-brand-highlight font-bold mt-2">
               {new URL(joinUrl).hostname}
           </div>
        </div>
        <div className="text-right">
            <h1 className="text-4xl font-light text-gray-400">Scan to play</h1>
        </div>
      </header>

      <main className="flex-1 flex gap-12">
        <div className="w-1/3 flex flex-col items-center justify-center">
            <RoomQRCode roomCode={roomCode} joinUrl={joinUrl} size={400} />
        </div>

        <div className="w-2/3 bg-white/5 rounded-3xl p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <h2 className="text-4xl font-bold">Players</h2>
                <span className="text-3xl bg-brand-highlight px-6 py-2 rounded-full">
                    {players.filter(p => p.role !== 'PRESENTER').length}
                </span>
            </div>
            <div className="flex-1 overflow-y-auto">
                <PlayerGrid players={players} />
            </div>
             <div className="mt-auto pt-8 text-center text-2xl text-gray-400 animate-pulse">
                Waiting for host to start...
            </div>
        </div>
      </main>
      
      {connectionStatus !== 'CONNECTED' && (
          <div className="fixed bottom-4 right-4 text-red-500 bg-white/10 px-4 py-2 rounded">
              Status: {connectionStatus}
          </div>
      )}
    </div>
  );
};
