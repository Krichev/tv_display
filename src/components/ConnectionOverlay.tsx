import React from 'react';
import { motion } from 'framer-motion';

interface ConnectionOverlayProps {
  status: 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
}

export const ConnectionOverlay: React.FC<ConnectionOverlayProps> = ({ status }) => {
  if (status === 'CONNECTED') return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div className="text-center p-12 rounded-3xl bg-gray-900 border-2 border-white/10 shadow-2xl">
        {status === 'CONNECTING' && (
          <>
            <div className="w-24 h-24 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-8" />
            <h2 className="text-4xl font-bold text-white mb-4">Connecting to Room...</h2>
            <p className="text-xl text-gray-400">Wait a moment, the puzzle is almost ready.</p>
          </>
        )}

        {status === 'DISCONNECTED' && (
          <>
            <div className="text-8xl mb-8">📡</div>
            <h2 className="text-4xl font-bold text-white mb-4">Disconnected</h2>
            <p className="text-xl text-gray-400">Trying to reconnect automatically...</p>
          </>
        )}

        {status === 'ERROR' && (
          <>
            <div className="text-8xl mb-8">⚠️</div>
            <h2 className="text-4xl font-bold text-red-500 mb-4">Connection Error</h2>
            <p className="text-xl text-gray-400 mb-8">Could not connect to the game server.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
            >
              Retry Connection
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};
