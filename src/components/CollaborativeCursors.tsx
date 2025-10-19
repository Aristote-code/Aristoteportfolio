import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { createClient } from '../utils/supabase/client';
import { getUserId } from '../utils/avatarUtils';

interface CursorPosition {
  x: number;
  y: number;
  userId: string;
  userName: string;
  color: string;
  timestamp: number;
}

interface CollaborativeCursorsProps {
  userName: string;
  userColor: string;
  isActive: boolean; // Only show when user is active (not in admin or comment mode)
}

function AnimatedCursor({ cursor }: { cursor: CursorPosition }) {
  const cursorX = useMotionValue(cursor.x);
  const cursorY = useMotionValue(cursor.y);
  
  // Ultra-fast spring animation like Figma - much snappier and more responsive
  const springConfig = { damping: 20, stiffness: 800, mass: 0.2 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    cursorX.set(cursor.x);
    cursorY.set(cursor.y);
  }, [cursor.x, cursor.y, cursorX, cursorY]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.08 }}
      className="absolute will-change-transform"
      style={{
        x,
        y,
        transform: 'translate(-2px, -2px)',
      }}
    >
      {/* Cursor pointer */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <path
          d="M5.65376 12.3673L5.46026 5.31768C5.44887 4.75354 6.08239 4.42692 6.51447 4.76986L18.2463 14.4429C18.6697 14.7793 18.4848 15.4459 17.9264 15.5105L13.0146 16.0502L14.9048 22.4136C15.0501 22.8927 14.6035 23.3239 14.1288 23.1631L9.84947 21.6678C9.37479 21.507 9.12292 20.9773 9.32656 20.5176L11.5484 15.3325L7.67352 13.7931C7.14599 13.5881 6.95374 12.9419 7.29645 12.5141L7.29643 12.5141L7.29647 12.5141L7.3008 12.5094L7.30507 12.5047L5.65376 12.3673Z"
          fill={cursor.color}
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Name label */}
      <div
        className="absolute left-6 top-0 px-2.5 py-1 rounded-md text-white font-['Gaegu'] text-[13px] whitespace-nowrap shadow-lg pointer-events-none"
        style={{ backgroundColor: cursor.color }}
      >
        {cursor.userName}
      </div>
    </motion.div>
  );
}

export function CollaborativeCursors({ userName, userColor, isActive }: CollaborativeCursorsProps) {
  const [otherCursors, setOtherCursors] = useState<Map<string, CursorPosition>>(new Map());
  const channelRef = useRef<any>(null);
  const lastBroadcastRef = useRef<number>(0);
  const userId = getUserId();

  useEffect(() => {
    if (!isActive || !userName || !userColor) return;

    // Use singleton Supabase client
    const supabase = createClient();

    // Create a channel for cursor presence
    const channel = supabase.channel('cursors', {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    // Track other users' presence
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const newCursors = new Map<string, CursorPosition>();

        Object.entries(state).forEach(([key, presences]: [string, any[]]) => {
          if (key !== userId && presences.length > 0) {
            const presence = presences[0];
            newCursors.set(key, {
              x: presence.x,
              y: presence.y,
              userId: key,
              userName: presence.userName,
              color: presence.color,
              timestamp: presence.timestamp,
            });
          }
        });

        setOtherCursors(newCursors);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key);
        setOtherCursors((prev) => {
          const newMap = new Map(prev);
          newMap.delete(key);
          return newMap;
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track initial presence
          await channel.track({
            x: 0,
            y: 0,
            userName,
            color: userColor,
            timestamp: Date.now(),
          });
        }
      });

    channelRef.current = channel;

    // Handle mouse movement with minimal throttling for near real-time updates (like Figma)
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      // Ultra-fast throttling: ~100 updates per second (every 10ms) for seamless real-time feel
      if (now - lastBroadcastRef.current < 10) return;

      lastBroadcastRef.current = now;

      // Broadcast cursor position
      channel.track({
        x: e.clientX,
        y: e.clientY + window.scrollY,
        userName,
        color: userColor,
        timestamp: now,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [userName, userColor, isActive, userId]);

  // Clean up stale cursors (inactive for more than 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setOtherCursors((prev) => {
        const newMap = new Map(prev);
        let changed = false;

        newMap.forEach((cursor, key) => {
          if (now - cursor.timestamp > 5000) {
            newMap.delete(key);
            changed = true;
          }
        });

        return changed ? newMap : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      <AnimatePresence>
        {Array.from(otherCursors.values()).map((cursor) => (
          <AnimatedCursor key={cursor.userId} cursor={cursor} />
        ))}
      </AnimatePresence>
    </div>
  );
}
