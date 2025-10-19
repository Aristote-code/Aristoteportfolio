import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { ArrowUp, Smile, AtSign, Image } from 'lucide-react';
import { getAvatarColor, getAvatarInitial, getUserId } from '../utils/avatarUtils';

interface CommentInputProps {
  x: number;
  y: number;
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

export function CommentInput({ x, y, onSubmit, onCancel }: CommentInputProps) {
  const [text, setText] = useState('');
  const [position, setPosition] = useState<{ x: number; y: number }>({ x, y });
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  // Calculate smart positioning to keep box fully visible
  useEffect(() => {
    const boxWidth = 380;
    const boxHeight = 120;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;

    let adjustedX = x + 40; // Offset from pin
    let adjustedY = y - 20;

    // Adjust horizontal position if too close to right edge
    if (adjustedX + boxWidth > viewportWidth - 20) {
      adjustedX = x - boxWidth - 40;
    }
    
    // Adjust horizontal position if too close to left edge
    if (adjustedX < 20) {
      adjustedX = 20;
    }

    // Adjust vertical position if too close to bottom
    const absoluteY = y - scrollY;
    if (absoluteY + boxHeight > viewportHeight - 20) {
      adjustedY = y - boxHeight - 20;
      if (adjustedY < scrollY + 20) {
        adjustedY = scrollY + 20;
      }
    }

    setPosition({ x: adjustedX, y: adjustedY });
    
    // Auto-focus input
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [x, y]);

  const userId = getUserId();

  return (
    <>
      {/* Comment Pin */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute pointer-events-auto z-50"
        style={{ left: x, top: y }}
      >
        <div 
          className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
          style={{ backgroundColor: getAvatarColor(userId) }}
        >
          <span className="text-white font-['Gaegu'] text-[13px]">
            {getAvatarInitial(userId)}
          </span>
        </div>
      </motion.div>

      {/* Comment Input Box */}
      <motion.div
        ref={boxRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute z-50 pointer-events-auto"
        style={{ left: position.x, top: position.y }}
      >
        <div className="bg-white rounded-xl shadow-2xl w-[380px] overflow-hidden border border-[#e5e7f0]">
          {/* Text Input Area */}
          <div className="p-4">
            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              maxLength={500}
              rows={2}
              className="w-full bg-transparent text-[#474747] placeholder:text-[#8c8fa6] focus:outline-none resize-none text-[14px] leading-[1.4]"
              style={{ fontFamily: 'Solway, serif' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && text.trim()) {
                  e.preventDefault();
                  handleSubmit();
                }
                if (e.key === 'Escape') {
                  onCancel();
                }
              }}
            />
          </div>

          {/* Separator */}
          <div className="h-[1px] bg-[#e5e7f0]" />

          {/* Bottom Actions */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f3f3f5] transition-colors">
                <Smile className="w-5 h-5 text-[#8c8fa6]" />
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f3f3f5] transition-colors">
                <AtSign className="w-5 h-5 text-[#8c8fa6]" />
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f3f3f5] transition-colors">
                <Image className="w-5 h-5 text-[#8c8fa6]" />
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="w-9 h-9 rounded-full bg-[#8774ff] hover:bg-[#7860ff] flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Post comment"
            >
              <ArrowUp className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
