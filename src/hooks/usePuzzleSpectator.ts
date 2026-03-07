import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { 
  PuzzleSpectatorContext, 
  PuzzleStateMessage, 
  PiecePlacedMessage, 
  PlayerBoardSnapshot, 
  PieceMetadata, 
  SpectatorSnapshot,
  AnswerSubmittedMessage,
  PuzzleCompletedMessage
} from '../types/puzzle';
import { PlayerRole } from '../types/game';

const WS_URL = import.meta.env.VITE_WS_URL || '/ws-game';
const API_URL = import.meta.env.VITE_API_URL || '/api';

export function usePuzzleSpectator(roomCode: string): PuzzleSpectatorContext {
  const [connectionStatus, setConnectionStatus] = useState<PuzzleSpectatorContext['connectionStatus']>('CONNECTING');
  const [state, setState] = useState<PuzzleStateMessage | null>(null);
  const [players, setPlayers] = useState<PlayerBoardSnapshot[]>([]);
  const [pieces, setPieces] = useState<Record<number, PieceMetadata>>({});
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [completedData, setCompletedData] = useState<PuzzleCompletedMessage | null>(null);

  const clientRef = useRef<Client | null>(null);
  const tokenRef = useRef<string | null>(localStorage.getItem('tv_token'));

  // Resolve relative WS_URL to absolute for SockJS
  const resolvedWsUrl = WS_URL.startsWith('http') 
    ? WS_URL 
    : `${window.location.origin}${WS_URL}`;

  // Authentication logic (reused from useGameRoom)
  const authenticate = async () => {
    if (tokenRef.current) return tokenRef.current;
    const randomId = Math.random().toString(36).substring(7);
    const username = `tv_puzzle_${randomId}`;
    const password = 'password';
    try {
      await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email: `${username}@example.com`, password })
      });
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        const token = data.accessToken;
        localStorage.setItem('tv_token', token);
        tokenRef.current = token;
        return token;
      }
    } catch (e) {
      console.error("Auth failed", e);
    }
    return null;
  };

  const addEvent = (event: any) => {
    setRecentEvents(prev => [event, ...prev].slice(0, 10));
  };

  const connect = useCallback(async () => {
    const token = await authenticate();
    if (!token) {
      setConnectionStatus('ERROR');
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(resolvedWsUrl),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        setConnectionStatus('CONNECTED');
        
        // 1. Game State Changes
        client.subscribe(`/topic/room/${roomCode}/puzzle-state`, (message) => {
          const newState = JSON.parse(message.body);
          setState(newState);
        });

        // 2. Individual Piece Placements
        client.subscribe(`/topic/room/${roomCode}/puzzle-piece`, (message) => {
          const event: PiecePlacedMessage = JSON.parse(message.body);
          addEvent({ type: 'piece', ...event });
          
          // Optimistically update player board in state
          setPlayers(prev => prev.map(p => {
            if (p.userId === event.userId) {
              const newBoard = [...p.boardState.filter(bp => bp.pieceIndex !== event.pieceIndex), 
                                { pieceIndex: event.pieceIndex, currentRow: event.row, currentCol: event.col }];
              return { ...p, boardState: newBoard, piecesPlacedCorrectly: event.correct ? p.piecesPlacedCorrectly + 1 : p.piecesPlacedCorrectly };
            }
            return p;
          }));
        });

        // 3. Periodic Snapshots
        client.subscribe(`/topic/room/${roomCode}/puzzle-snapshot`, (message) => {
          const snapshot: SpectatorSnapshot = JSON.parse(message.body);
          setState(snapshot.state);
          setPlayers(snapshot.players);
          if (snapshot.pieces) {
            const pieceMap: Record<number, PieceMetadata> = {};
            snapshot.pieces.forEach(p => pieceMap[p.pieceIndex] = p);
            setPieces(pieceMap);
          }
        });

        // 4. Answer Submissions
        client.subscribe(`/topic/room/${roomCode}/puzzle-answer`, (message) => {
          const event: AnswerSubmittedMessage = JSON.parse(message.body);
          addEvent({ type: 'answer', ...event });
          setPlayers(prev => prev.map(p => p.userId === event.userId ? { ...p, hasAnswered: true } : p));
        });

        // 5. Game Completion
        client.subscribe(`/topic/room/${roomCode}/puzzle-completed`, (message) => {
          const data: PuzzleCompletedMessage = JSON.parse(message.body);
          setCompletedData(data);
        });

        // Join room and request initial snapshot
        client.publish({
          destination: `/app/room/${roomCode}/join`,
          body: JSON.stringify({ role: PlayerRole.PRESENTER })
        });
        
        client.publish({
          destination: `/app/room/${roomCode}/puzzle/request-snapshot`,
          body: JSON.stringify({})
        });
      },
      onDisconnect: () => setConnectionStatus('DISCONNECTED'),
      onStompError: () => setConnectionStatus('ERROR')
    });

    client.activate();
    clientRef.current = client;
  }, [roomCode]);

  useEffect(() => {
    connect();
    return () => { clientRef.current?.deactivate(); };
  }, [connect]);

  return {
    connectionStatus,
    state,
    players,
    pieces,
    recentEvents,
    completedData,
    timeLeft: state?.timeLeftSeconds ?? 0
  };
}
