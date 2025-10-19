import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import svgPaths from '../imports/svg-1peztmbabf';

interface CursorFollowerProps {
  name: string;
  color: string;
}

export function CursorFollower({ name, color }: CursorFollowerProps) {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let rafId: number;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      
      if (!isVisible) {
        setIsVisible(true);
        currentX = targetX;
        currentY = targetY;
      }
    };

    const updatePosition = () => {
      // Smooth easing
      const ease = 0.15;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      setPosition({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[80]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-12px, -12px)',
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="relative">
        {/* Cursor SVG */}
        <div className="absolute left-[-12px] top-[-12px] w-[18px] h-[18px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
            <g>
              <path 
                d={svgPaths.p58b9800} 
                fill={color}
              />
              <path 
                d={svgPaths.p21bcbd00} 
                stroke="black" 
                strokeMiterlimit="10" 
                strokeOpacity="0.1" 
              />
            </g>
          </svg>
        </div>

        {/* Name Tag */}
        <div 
          className="absolute left-[6px] top-[6px] px-[12px] py-[8px] rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.04),0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.1)]"
          style={{ backgroundColor: color }}
        >
          <p 
            className="capitalize font-['Figtree',_sans-serif] font-semibold text-[13px] text-[#231f20] whitespace-nowrap tracking-[0.4px] leading-[16px]"
          >
            {name}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Predefined pastel colors matching FigJam aesthetic
export const cursorColors = [
  '#FAC99C', // Orange
  '#FFC1CC', // Pink
  '#B4E7CE', // Mint
  '#C1D5F0', // Light Blue
  '#F5E6A8', // Yellow
  '#E5C1F5', // Lavender
  '#FFD1A1', // Peach
  '#A8E6CF', // Seafoam
  '#FFB3BA', // Coral
  '#BAFFC9', // Light Green
  '#D4A5A5', // Dusty Rose
  '#9ED9CC', // Teal
];

// Get or assign a random color for the user
export function getUserCursorColor(): string {
  const storageKey = 'userCursorColor';
  let color = localStorage.getItem(storageKey);
  
  if (!color) {
    color = cursorColors[Math.floor(Math.random() * cursorColors.length)];
    localStorage.setItem(storageKey, color);
  }
  
  return color;
}
