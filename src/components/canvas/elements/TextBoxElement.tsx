import { useRef, useState, useEffect } from 'react';
import { TextBoxElement as TextBoxType } from '../../../types/canvas';

interface Props {
  element: TextBoxType;
  isSelected: boolean;
  scale: number;
  onSelect: () => void;
  onUpdate: (patch: Partial<TextBoxType>) => void;
  onCommit: () => void;
  onDragStart: (e: React.PointerEvent) => void;
}

export function TextBoxElement({ element, isSelected, scale, onSelect, onUpdate, onCommit, onDragStart }: Props) {
  const [editing, setEditing] = useState(element.content === '');
  const editRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.focus();
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
    onUpdate({ content: editRef.current?.innerText ?? '' });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (editing) { e.stopPropagation(); return; }
    onSelect();
    onDragStart(e);
  };

  const fs = element.fontSize * scale;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        outline: isSelected ? '2px solid #4A90E2' : '2px solid transparent',
        outlineOffset: 2,
        borderRadius: 4,
        cursor: editing ? 'text' : 'grab',
      }}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
    >
      <div
        ref={editRef}
        contentEditable={editing}
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleBlur}
        style={{
          width: '100%',
          height: '100%',
          fontSize: Math.max(10, fs),
          fontWeight: element.fontWeight,
          color: element.color,
          textAlign: element.align as 'left' | 'center' | 'right',
          fontFamily: "'Figtree', sans-serif",
          outline: 'none',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.5,
          background: isSelected ? 'rgba(74,144,226,0.04)' : 'transparent',
          padding: 4,
          boxSizing: 'border-box',
        }}
      >
        {element.content || (editing ? '' : <span style={{ color: '#bbb', fontStyle: 'italic' }}>Type something…</span>)}
      </div>
    </div>
  );
}
