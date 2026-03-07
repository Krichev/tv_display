import { useState, useEffect, useCallback, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export type PairingPhase = 'IDLE' | 'REGISTERING' | 'WAITING_FOR_CLAIM' | 'CLAIMED' | 'EXPIRED' | 'ERROR';

export interface UseTvPairing {
  phase: PairingPhase;
  pairingCode: string | null;
  roomCode: string | null;
  error: string | null;
  retry: () => void;
}

export function useTvPairing(): UseTvPairing {
  const [phase, setPhase] = useState<PairingPhase>('IDLE');
  const [displayId, setDisplayId] = useState<number | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const tokenRef = useRef<string | null>(null);
  const pollIntervalRef = useRef<number | null>(null);

  const register = useCallback(async () => {
    setPhase('REGISTERING');
    setError(null);
    try {
      const res = await fetch(`${API_URL}/tv-displays/register`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to register TV');
      
      const data = await res.json();
      setDisplayId(data.displayId);
      setPairingCode(data.pairingCode);
      tokenRef.current = data.token;
      localStorage.setItem('tv_token', data.token);
      
      setPhase('WAITING_FOR_CLAIM');
    } catch (e: any) {
      setPhase('ERROR');
      setError(e.message);
    }
  }, []);

  const checkStatus = useCallback(async () => {
    if (!displayId || !tokenRef.current) return;
    
    try {
      const res = await fetch(`${API_URL}/tv-displays/${displayId}/status`, {
        headers: {
          'Authorization': `Bearer ${tokenRef.current}`
        }
      });
      
      if (!res.ok) {
          if (res.status === 401 || res.status === 404) {
              setPhase('EXPIRED');
              return;
          }
          throw new Error('Status check failed');
      }
      
      const data = await res.json();
      if (data.status === 'CLAIMED') {
          setRoomCode(data.roomCode);
          setPhase('CLAIMED');
      } else if (data.status === 'EXPIRED') {
          setPhase('EXPIRED');
      }
    } catch (e) {
      console.error('Failed to poll status', e);
    }
  }, [displayId]);

  useEffect(() => {
    register();
  }, [register]);

  useEffect(() => {
    if (phase === 'WAITING_FOR_CLAIM') {
      pollIntervalRef.current = window.setInterval(checkStatus, 2000);
    } else {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }
    
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [phase, checkStatus]);

  useEffect(() => {
    if (phase === 'EXPIRED') {
        // Auto-re-register if expired
        register();
    }
  }, [phase, register]);

  return {
    phase,
    pairingCode,
    roomCode,
    error,
    retry: register
  };
}
