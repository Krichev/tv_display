export type PuzzleGameMode = 'SHARED' | 'INDIVIDUAL';

export type PuzzlePhase = 
  | 'CREATED' 
  | 'DISTRIBUTING' 
  | 'IN_PROGRESS' 
  | 'GUESSING' 
  | 'COMPLETED' 
  | 'ABANDONED';

export interface PuzzleStateMessage {
  roomCode: string;
  puzzleGameId: number;
  phase: PuzzlePhase;
  gameMode: PuzzleGameMode;
  gridRows: number;
  gridCols: number;
  timeLeftSeconds?: number;
  totalPieces: number;
  teamCorrectCount: number;
}

export interface PiecePlacedMessage {
  userId: number;
  username: string;
  pieceIndex: number;
  row: number;
  col: number;
  correct: boolean;
}

export interface PlayerBoardSnapshot {
  userId: number;
  username: string;
  boardState: PiecePlacement[];
  piecesPlacedCorrectly: number;
  hasAnswered: boolean;
}

export interface PiecePlacement {
  pieceIndex: number;
  currentRow: number;
  currentCol: number;
}

export interface PieceMetadata {
  pieceIndex: number;
  imageUrl: string;
  svgClipPath: string;
  edgeTop: string;
  edgeRight: string;
  edgeBottom: string;
  edgeLeft: string;
  widthPx: number;
  heightPx: number;
}

export interface SpectatorSnapshot {
  state: PuzzleStateMessage;
  players: PlayerBoardSnapshot[];
  pieces: PieceMetadata[] | null;
}

export interface AnswerSubmittedMessage {
  userId: number;
  username: string;
  correct: boolean;
  score: number;
}

export interface PlayerResult {
  username: string;
  score: number;
  piecesPlacedCorrectly: number;
  totalMoves: number;
  completionTimeMs?: number;
  rank: number;
}

export interface PuzzleCompletedMessage {
  sourceImageUrl: string;
  correctAnswer: string;
  leaderboard: PlayerResult[];
}

export interface PuzzleSpectatorContext {
  connectionStatus: 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  state: PuzzleStateMessage | null;
  players: PlayerBoardSnapshot[];
  pieces: Record<number, PieceMetadata>;
  recentEvents: any[];
  completedData: PuzzleCompletedMessage | null;
  timeLeft: number;
}
