import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { GameContextType, GamePhase, GameState, PlayerRole, RoomPlayer, Question } from '../types/game';

const WS_URL = import.meta.env.VITE_WS_URL || '/ws-game';
const API_URL = import.meta.env.VITE_API_URL || '/api';

export function useGameRoom(roomCode: string): GameContextType {
  const [connectionStatus, setConnectionStatus] = useState<GameContextType['connectionStatus']>('CONNECTING');
  const [gameState, setGameState] = useState<GameState>({
    roomCode,
    phase: GamePhase.LOBBY
  });
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(undefined);
  const [timeLeft, setTimeLeft] = useState(0);

  const clientRef = useRef<Client | null>(null);
  const tokenRef = useRef<string | null>(localStorage.getItem('tv_token'));

  // Resolve relative WS_URL to absolute for SockJS
  const resolvedWsUrl = WS_URL.startsWith('http') 
    ? WS_URL 
    : `${window.location.origin}${WS_URL}`;

  // Timer logic
  useEffect(() => {
    if (!gameState.timerEndTime) {
        setTimeLeft(0);
        return;
    }
    
    const end = new Date(gameState.timerEndTime).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.max(0, Math.ceil((end - now) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.timerEndTime]);

  // Fetch question details when ID changes
  useEffect(() => {
    if (gameState.currentQuestionId) {
      const fetchQuestion = async () => {
        try {
            // Need token for this? likely yes.
           const headers: HeadersInit = tokenRef.current ? { 'Authorization': `Bearer ${tokenRef.current}` } : {};
           const res = await fetch(`${API_URL}/quiz-questions/${gameState.currentQuestionId}`, { headers });
           if (res.ok) {
             const data = await res.json();
             setCurrentQuestion({
                 id: data.id,
                 text: data.question,
                 type: data.questionType,
                 mediaUrl: data.mediaUrl, // Assuming enriched DTO has this
                 mediaType: data.mediaType
             });
           }
        } catch (e) {
          console.error("Failed to fetch question", e);
        }
      };
      fetchQuestion();
    }
  }, [gameState.currentQuestionId]);

  // Auto-login/register for TV
  const authenticate = async () => {
    if (tokenRef.current) return tokenRef.current;

    const randomId = Math.random().toString(36).substring(7);
    const username = `tv_display_${randomId}`;
    const password = 'password';

    try {
      // Signup
      await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email: `${username}@example.com`, password })
      });

      // Signin
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

  const connect = useCallback(async () => {
    const token = await authenticate();
    if (!token) {
        setConnectionStatus('ERROR');
        return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(resolvedWsUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      onConnect: () => {
        setConnectionStatus('CONNECTED');
        
        // Subscribe to room topics
        client.subscribe(`/topic/room/${roomCode}/state`, (message) => {
           const state = JSON.parse(message.body);
           setGameState(state);
        });

        client.subscribe(`/topic/room/${roomCode}/players`, (message) => {
            const data = JSON.parse(message.body);
            // data is { players: [...] } or just [...] depending on backend DTO
            // Backend sends PlayerListMessage(players) -> { players: [...] }
            setPlayers(data.players || []);
        });

        client.subscribe(`/topic/room/${roomCode}/answers`, (message) => {
            const answer = JSON.parse(message.body);
            // Update player state locally to show "answered"
            setPlayers(prev => prev.map(p => 
                p.userId === answer.userId ? { ...p, lastAnswer: 'answered' } : p
            ));
        });

        // Join as PRESENTER
        client.publish({
            destination: `/app/room/${roomCode}/join`,
            body: JSON.stringify({ role: PlayerRole.PRESENTER })
        });
      },
      onDisconnect: () => {
        setConnectionStatus('DISCONNECTED');
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        setConnectionStatus('ERROR');
      }
    });

    client.activate();
    clientRef.current = client;
  }, [roomCode]);

  useEffect(() => {
    connect();
    return () => {
        clientRef.current?.deactivate();
    };
  }, [connect]);

  return {
    connectionStatus,
    gameState,
    players,
    currentQuestion,
    timeLeft,
    roomCode
  };
}
