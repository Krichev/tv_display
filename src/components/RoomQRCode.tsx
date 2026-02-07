import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

interface RoomQRCodeProps {
  roomCode: string;
  joinUrl: string;
  size?: number;
}

export const RoomQRCode: React.FC<RoomQRCodeProps> = ({ roomCode, joinUrl, size = 300 }) => {
  return (
    <motion.div 
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center gap-6 bg-white p-8 rounded-3xl shadow-2xl"
    >
      <QRCodeSVG 
        value={joinUrl} 
        size={size}
        level="M"
        includeMargin={false}
      />
      <div className="flex flex-col items-center">
        <span className="text-gray-500 text-xl font-bold uppercase tracking-widest">Room Code</span>
        <span className="text-brand-dark text-6xl font-black tracking-tighter">{roomCode}</span>
      </div>
    </motion.div>
  );
};
