import React from 'react';
import { RoomQRCode } from '../components/RoomQRCode';
import { motion } from 'framer-motion';

interface PairingScreenProps {
  pairingCode: string;
}

export const PairingScreen: React.FC<PairingScreenProps> = ({ pairingCode }) => {
  // Construct a pairing URL for the mobile app to handle if scanned
  const pairUrl = `${window.location.origin}/pair/${pairingCode}`;

  return (
    <div className="h-screen w-screen bg-brand-dark flex flex-col items-center justify-center text-white overflow-hidden">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <h1 className="text-8xl font-black mb-4 tracking-tight">Connect TV</h1>
        <p className="text-3xl text-gray-400 font-medium">Open the Challenger app to connect this display</p>
      </motion.div>

      <div className="flex flex-row items-center gap-24">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col items-start gap-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-12 rounded-[3rem] shadow-inner">
             <div className="text-xl font-bold text-brand-highlight uppercase tracking-[0.3em] mb-4">Pairing Code</div>
             <div className="flex gap-4">
                {pairingCode.split('').map((char, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="w-24 h-32 bg-white rounded-2xl flex items-center justify-center text-brand-dark text-7xl font-black shadow-lg"
                  >
                    {char}
                  </motion.div>
                ))}
             </div>
          </div>
          
          <div className="flex items-center gap-6 px-4">
            <div className="w-4 h-4 rounded-full bg-brand-highlight animate-ping" />
            <span className="text-2xl font-semibold text-gray-300">Waiting for host to claim...</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <RoomQRCode roomCode={pairingCode} joinUrl={pairUrl} size={350} />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-0 right-0 text-center text-gray-500 text-xl font-medium"
      >
        TV becomes a pure display — no interaction required
      </motion.div>
    </div>
  );
};
