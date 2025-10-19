import { motion } from 'motion/react';
import { useState } from 'react';

interface StickyNoteProps {
  text: string;
  color?: 'yellow' | 'green' | 'pink' | 'blue' | 'purple' | 'cyan' | 'orange';
  initialX?: number;
  initialY?: number;
  rotation?: number;
  draggable?: boolean;
}

const colorClasses = {
  yellow: 'bg-[#ffe5a3]',
  green: 'bg-[#b8ffc6]',
  pink: 'bg-[#ffa3a3]',
  blue: 'bg-[#94e6ff]',
  purple: 'bg-[#cda3ff]',
  cyan: 'bg-[#94e6ff]',
  orange: 'bg-[#faefcc]',
};

export function StickyNote({
  text,
  color = 'yellow',
  initialX = 0,
  initialY = 0,
  rotation = 0,
  draggable = true,
}: StickyNoteProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });

  return (
    <motion.div
      drag={draggable}
      dragMomentum={false}
      dragElastic={0.1}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1, rotate: rotation + 3, zIndex: 50 }}
      style={{ x: position.x, y: position.y }}
      onDragEnd={(event, info) => {
        setPosition({
          x: position.x + info.offset.x,
          y: position.y + info.offset.y,
        });
      }}
      className={`${draggable ? 'cursor-grab active:cursor-grabbing' : ''} select-none`}
      initial={{ rotate: rotation }}
    >
      <div
        className={`${colorClasses[color]} px-4 py-4 min-w-[130px] max-w-[130px] min-h-[130px] flex items-center justify-center text-center font-['Gaegu']`}
        style={{
          boxShadow: '0px 20px 10px -14px rgba(64, 49, 160, 0.28)',
        }}
      >
        <p className="text-[20px] leading-[24px] whitespace-pre-line text-[#474747]">{text}</p>
      </div>
    </motion.div>
  );
}
