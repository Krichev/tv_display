import React from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useGameRoom } from './hooks/useGameRoom';
import { GamePhase } from './types/game';
import { LobbyScreen } from './screens/LobbyScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { AnswerRevealScreen } from './screens/AnswerRevealScreen';
import { PuzzleDisplay } from './screens/PuzzleDisplay';

import { useTvPairing } from './hooks/useTvPairing';
import { PairingScreen } from './screens/PairingScreen';

function GameDisplay() {
  const { roomCode } = useParams<{ roomCode: string }>();
  
  // If no room code, maybe redirect to home or show error
  if (!roomCode) {
      return <div className="text-white text-2xl p-8">No room code provided</div>;
  }

  const gameContext = useGameRoom(roomCode);
  const { gameState, connectionStatus } = gameContext;

  if (connectionStatus === 'CONNECTING') {
      return (
          <div className="h-screen w-screen flex items-center justify-center bg-brand-dark text-white">
              <div className="text-4xl animate-pulse">Connecting to Room {roomCode}...</div>
          </div>
      );
  }

  if (connectionStatus === 'ERROR') {
      return (
          <div className="h-screen w-screen flex items-center justify-center bg-brand-dark text-red-500">
              <div className="text-center">
                  <div className="text-6xl font-bold mb-4">Connection Error</div>
                  <div className="text-2xl text-white">Could not connect to game server.</div>
                  <button onClick={() => window.location.reload()} className="mt-8 px-8 py-4 bg-white text-black text-xl rounded-xl">Retry</button>
              </div>
          </div>
      );
  }

  switch (gameState.phase) {
      case GamePhase.LOBBY:
          return <LobbyScreen gameContext={gameContext} />;
      case GamePhase.READING:
      case GamePhase.DISCUSSION:
      case GamePhase.ANSWERING:
          return <QuestionScreen gameContext={gameContext} />;
      case GamePhase.FEEDBACK:
          return <AnswerRevealScreen gameContext={gameContext} />; // Or Leaderboard depending on flow
      case GamePhase.COMPLETED:
          return <LeaderboardScreen gameContext={gameContext} />;
      default:
          return <LobbyScreen gameContext={gameContext} />;
  }
}

function Home() {
    const { phase, pairingCode, roomCode, error, retry } = useTvPairing();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (phase === 'CLAIMED' && roomCode) {
            navigate(`/${roomCode}`);
        }
    }, [phase, roomCode, navigate]);

    if (phase === 'REGISTERING' || phase === 'IDLE') {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-brand-dark text-white">
                <div className="text-4xl animate-pulse">Initializing TV Display...</div>
            </div>
        );
    }

    if (phase === 'ERROR') {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-brand-dark text-red-500">
                <div className="text-center">
                    <div className="text-6xl font-bold mb-4">Error</div>
                    <div className="text-2xl text-white">{error || 'Failed to initialize display'}</div>
                    <button onClick={retry} className="mt-8 px-8 py-4 bg-white text-black text-xl rounded-xl">Retry</button>
                </div>
            </div>
        );
    }

    return <PairingScreen pairingCode={pairingCode || '------'} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomCode" element={<GameDisplay />} />
        <Route path="/puzzle/:roomCode" element={<PuzzleDisplay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
