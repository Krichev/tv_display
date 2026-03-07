import React from 'react';
import { motion } from 'framer-motion';
import { PieceMetadata } from '../types/puzzle';

interface JigsawPieceSvgProps {
  piece: PieceMetadata;
  width: number;
  height: number;
  x: number;
  y: number;
  isCorrect?: boolean;
  playerName?: string;
  animate?: boolean;
}

export const JigsawPieceSvg: React.FC<JigsawPieceSvgProps> = React.memo(({ 
  piece, 
  width, 
  height, 
  x, 
  y, 
  isCorrect,
  playerName,
  animate = true
}) => {
  return (
    <motion.div
      initial={animate ? { scale: 0, opacity: 0, x, y } : false}
      animate={{ scale: 1, opacity: 1, x, y }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      style={{ width, height, position: 'absolute' }}
      className="pointer-events-none"
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${piece.widthPx} ${piece.heightPx}`}
        className={isCorrect ? "drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" : "drop-shadow-lg"}
      >
        <defs>
          <clipPath id={`clip-${piece.pieceIndex}`}>
            <path d={piece.svgClipPath} />
          </clipPath>
        </defs>
        
        <image
          href={piece.imageUrl}
          width={piece.widthPx}
          height={piece.heightPx}
          clipPath={`url(#clip-${piece.pieceIndex})`}
        />
        
        <path
          d={piece.svgClipPath}
          fill="none"
          stroke={isCorrect ? "#4ade80" : "rgba(255,255,255,0.3)"}
          strokeWidth="2"
        />
      </svg>

      {playerName && (
        <div className="absolute top-0 left-0 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white font-bold">
          {playerName}
        </div>
      )}
    </motion.div>
  );
});
