import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PuzzleStateMessage, PlayerBoardSnapshot, PieceMetadata } from '../types/puzzle';
import { JigsawPieceSvg } from '../components/JigsawPieceSvg';

interface PuzzleBoardScreenProps {
  state: PuzzleStateMessage;
  players: PlayerBoardSnapshot[];
  pieces: Record<number, PieceMetadata>;
  recentEvents: any[];
  timeLeft: number;
}

export const PuzzleBoardScreen: React.FC<PuzzleBoardScreenProps> = ({ 
  state, 
  players, 
  pieces, 
  recentEvents,
  timeLeft 
}) => {
  // Sizing constants
  const BOARD_SIZE = 800;
  const cellWidth = BOARD_SIZE / state.gridCols;
  const cellHeight = BOARD_SIZE / state.gridRows;

  // Flatten all pieces from all players for the TV display
  const placedPieces = useMemo(() => {
    const map: Record<number, { pieceIndex: number, row: number, col: number, playerName: string, correct: boolean }> = {};
    
    players.forEach(p => {
      p.boardState.forEach(pb => {
        // In Individual mode, we might only show the leader or a composite? 
        // For Shared mode, all pieces go on one board.
        if (state.gameMode === 'SHARED') {
          const pieceMeta = pieces[pb.pieceIndex];
          const isCorrect = pieceMeta?.pieceIndex === pb.pieceIndex; // Backend should send correct flag
          
          map[pb.pieceIndex] = {
            pieceIndex: pb.pieceIndex,
            row: pb.currentRow,
            col: pb.currentCol,
            playerName: p.username,
            correct: pb.currentRow === pieceMeta?.pieceIndex / state.gridCols // Temporary check
          };
        }
      });
    });
    return Object.values(map);
  }, [players, pieces, state.gameMode]);

  const teamProgress = (state.teamCorrectCount / state.totalPieces) * 100;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8 flex flex-col overflow-hidden">
      {/* HUD Bar */}
      <div className="flex items-center justify-between bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 mb-8 border border-white/10 shadow-2xl">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-blue-400">PICTURE PUZZLE</h1>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{state.gameMode} MODE</p>
          </div>
          
          <div className="h-12 w-[1px] bg-white/10" />
          
          <div className="w-96">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-gray-400">TEAM PROGRESS</span>
              <span className="text-sm font-bold text-blue-400">{state.teamCorrectCount} / {state.totalPieces}</span>
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-white/5 p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${teamProgress}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="text-center">
            <p className="text-sm font-bold text-gray-400 uppercase mb-1">Time Remaining</p>
            <p className={`text-4xl font-mono font-black ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <p className="text-xs font-bold text-gray-500 uppercase mb-1 text-center">Room Code</p>
            <p className="text-3xl font-black tracking-widest text-white">{state.roomCode}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-8 min-h-0">
        {/* Main Puzzle Board Area */}
        <div className="flex-[3] flex items-center justify-center bg-gray-900/40 rounded-[3rem] border-2 border-white/5 relative overflow-hidden">
          {/* Grid Background */}
          <div 
            className="relative bg-gray-800/20 rounded-2xl overflow-hidden border border-white/10"
            style={{ width: BOARD_SIZE, height: BOARD_SIZE }}
          >
            <div 
              className="absolute inset-0 grid" 
              style={{ 
                gridTemplateColumns: `repeat(${state.gridCols}, 1fr)`,
                gridTemplateRows: `repeat(${state.gridRows}, 1fr)` 
              }}
            >
              {[...Array(state.gridRows * state.gridCols)].map((_, i) => (
                <div key={i} className="border border-white/5 border-dashed" />
              ))}
            </div>

            {/* Placed Pieces */}
            <AnimatePresence>
              {placedPieces.map((pp) => (
                pieces[pp.pieceIndex] && (
                  <JigsawPieceSvg
                    key={pp.pieceIndex}
                    piece={pieces[pp.pieceIndex]}
                    width={cellWidth * 1.4}
                    height={cellHeight * 1.4}
                    x={pp.col * cellWidth - (cellWidth * 0.2)}
                    y={pp.row * cellHeight - (cellHeight * 0.2)}
                    playerName={pp.playerName}
                    isCorrect={pp.correct}
                  />
                )
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex-1 bg-gray-900/60 rounded-[2rem] p-6 border border-white/5 flex flex-col overflow-hidden shadow-xl">
            <h2 className="text-2xl font-bold mb-6 flex justify-between">
              Players 
              <span className="text-gray-500 text-sm">{players.length} online</span>
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-4">
                {players.sort((a,b) => b.piecesPlacedCorrectly - a.piecesPlacedCorrectly).map((p, i) => (
                  <motion.div 
                    layout
                    key={p.userId}
                    className="bg-gray-800/40 p-4 rounded-2xl border border-white/5 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xl">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-bold truncate text-lg">{p.username}</p>
                        {p.hasAnswered && <span className="text-green-400 text-xs font-black uppercase">Guessed!</span>}
                      </div>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-gray-400 font-mono">{p.piecesPlacedCorrectly} pieces</span>
                        <span className="text-xs text-gray-400 font-mono">{p.boardState.length} moves</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="h-64 bg-gray-900/60 rounded-[2rem] p-6 border border-white/5 flex flex-col shadow-xl">
            <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-4">Live Activity</h3>
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence>
                {recentEvents.map((event, i) => (
                  <motion.div
                    key={event.timestamp || i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    className="mb-3 flex items-center gap-3 text-sm"
                  >
                    <span className="text-gray-500 font-mono text-xs">{(new Date().toLocaleTimeString()).split(' ')[0]}</span>
                    {event.type === 'piece' ? (
                      <p><span className="text-blue-400 font-bold">{event.username}</span> placed a piece</p>
                    ) : (
                      <p><span className="text-green-400 font-bold">{event.username}</span> submitted a guess</p>
                    )}
                  </motion.div>
                )).slice(0, 5)}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
