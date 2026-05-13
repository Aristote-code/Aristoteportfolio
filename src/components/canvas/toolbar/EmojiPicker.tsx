import { useState } from 'react';
import { Smile } from 'lucide-react';

const EMOJIS = [
  '👍', '❤️', '🔥', '⭐', '💯', '🎉', '✅', '❌', '⚠️', '💡',
  '🎯', '🚀', '💎', '🧩', '🎨', '✨', '💬', '📌', '🏆', '🔑',
  '💥', '🌟', '📝', '🔍', '⚡', '🛠️', '🎬', '📊', '🌈', '🤔',
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  active: boolean;
}

export function EmojiPicker({ onSelect, active }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Emoji stamp"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 8,
          borderRadius: 8,
          border: 'none',
          background: active || open ? '#8774ff' : 'transparent',
          color: active || open ? 'white' : '#474747',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { if (!active && !open) e.currentTarget.style.background = '#f3f4f6'; }}
        onMouseLeave={e => { if (!active && !open) e.currentTarget.style.background = 'transparent'; }}
      >
        <Smile size={20} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 8,
            background: 'white',
            border: '1px solid #e5e7f0',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            padding: 10,
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 4,
            zIndex: 100,
          }}
          onPointerDown={e => e.stopPropagation()}
        >
          {EMOJIS.map(em => (
            <button
              key={em}
              onClick={() => handleSelect(em)}
              style={{
                fontSize: 20,
                padding: 6,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                borderRadius: 6,
                lineHeight: 1,
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {em}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
