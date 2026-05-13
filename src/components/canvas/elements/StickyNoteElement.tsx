import { useRef, useState, useEffect } from 'react';
import { StickyNoteElement as StickyNoteType } from '../../../types/canvas';

const COLORS: Record<StickyNoteType['color'], { bg: string; border: string }> = {
  yellow:  { bg: '#fef08a', border: '#facc15' },
  green:   { bg: '#bbf7d0', border: '#4ade80' },
  pink:    { bg: '#fecdd3', border: '#f472b6' },
  blue:    { bg: '#bfdbfe', border: '#60a5fa' },
  purple:  { bg: '#e9d5ff', border: '#c084fc' },
  cyan:    { bg: '#a5f3fc', border: '#22d3ee' },
  orange:  { bg: '#fed7aa', border: '#fb923c' },
};

interface Props {
  element: StickyNoteType;
  isSelected: boolean;
  scale: number;
  onSelect: () => void;
  onUpdate: (patch: Partial<StickyNoteType>) => void;
  onCommit: () => void;
  onDragStart: (e: React.PointerEvent) => void;
}

export function StickyNoteElement({ element, isSelected, scale, onSelect, onUpdate, onCommit, onDragStart }: Props) {
  const [editing, setEditing] = useState(element.text === '');
  const editRef = useRef<HTMLDivElement>(null);
  const col = COLORS[element.color];

  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.focus();
      // Place cursor at end
      const range = document.createRange();
      range.selectNodeContents(editRef.current);
      range.collapse(false);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    }
  }, [editing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    onCommit();
  };

  const handleInput = () => {
    onUpdate({ text: editRef.current?.innerText ?? '' });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (editing) { e.stopPropagation(); return; }
    onSelect();
    onDragStart(e);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: col.bg,
        border: `2px solid ${isSelected ? '#4A90E2' : col.border}`,
        borderRadius: 8,
        boxShadow: isSelected
          ? '0 0 0 3px rgba(74,144,226,0.3), 0 4px 12px rgba(0,0,0,0.12)'
          : '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: editing ? 'text' : 'grab',
        userSelect: editing ? 'text' : 'none',
        transition: 'box-shadow 0.15s',
      }}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Color dots bar */}
      {isSelected && (
        <div
          style={{
            display: 'flex',
            gap: 4,
            padding: '4px 6px',
            background: 'rgba(255,255,255,0.6)',
            borderBottom: `1px solid ${col.border}`,
          }}
          onPointerDown={e => e.stopPropagation()}
        >
          {(Object.keys(COLORS) as StickyNoteType['color'][]).map(c => (
            <button
              key={c}
              onClick={() => { onUpdate({ color: c }); onCommit(); }}
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: COLORS[c].bg,
                border: `2px solid ${c === element.color ? '#333' : COLORS[c].border}`,
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      )}

      {/* Text */}
      <div
        ref={editRef}
        contentEditable={editing}
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleBlur}
        style={{
          flex: 1,
          padding: 10,
          fontSize: Math.max(11, element.fontSize * scale),
          fontFamily: "'Gaegu', cursive",
          color: '#333',
          outline: 'none',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.4,
          minHeight: 20,
        }}
      >
        {element.text || (editing ? '' : <span style={{ color: '#aaa', fontStyle: 'italic' }}>Double-click to edit…</span>)}
      </div>
    </div>
  );
}
