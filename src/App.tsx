import React from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useGameRoom } from './hooks/useGameRoom';
import { GamePhase } from './types/game';
import { LobbyScreen } from './screens/LobbyScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { AnswerRevealScreen } from './screens/AnswerRevealScreen';

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
    const [code, setCode] = React.useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code) navigate(`/${code.toUpperCase()}`);
    };

    return (
        <div className="h-screen w-screen bg-brand-dark flex flex-col items-center justify-center text-white">
            <h1 className="text-6xl font-bold mb-12">TV Display</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input 
                    className="text-4xl text-black px-8 py-4 rounded-xl text-center uppercase tracking-widest"
                    placeholder="ROOM CODE"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    maxLength={6}
                />
                <button className="bg-brand-highlight text-white text-2xl py-4 rounded-xl font-bold">START DISPLAY</button>
            </form>
        </div>
    );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomCode" element={<GameDisplay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
