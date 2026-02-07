export enum GamePhase {
  LOBBY = 'LOBBY',
  READING = 'READING',
  DISCUSSION = 'DISCUSSION',
  ANSWERING = 'ANSWERING',
  FEEDBACK = 'FEEDBACK',
  COMPLETED = 'COMPLETED'
}

export enum PlayerRole {
  HOST = 'HOST',
  PLAYER = 'PLAYER',
  PRESENTER = 'PRESENTER'
}

export interface RoomPlayer {
  userId: number;
  username: string;
  role: PlayerRole;
  connected: boolean;
  score: number;
  lastAnswer?: string;
  avatarUrl?: string; // Optional if we want to add it
}

export interface GameState {
  roomCode: string;
  phase: GamePhase;
  currentQuestionId?: number;
  timerEndTime?: string; // ISO string
}

export interface Question {
  id: number;
  text: string;
  type: string; // 'MULTIPLE_CHOICE', 'TRUE_FALSE', etc.
  options?: string[]; // Or more complex structure depending on backend
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO' | 'AUDIO';
  correctAnswer?: string; // Revealed in FEEDBACK phase
}

export interface GameContextType {
  connectionStatus: 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  gameState: GameState;
  players: RoomPlayer[];
  currentQuestion?: Question;
  timeLeft: number;
  roomCode?: string;
}
