import { useRef, useState } from 'react';
import { ImageElement as ImageType } from '../../../types/canvas';

interface Props {
  element: ImageType;
  isSelected: boolean;
  scale: number;
  onSelect: () => void;
  onResize: (patch: Partial<ImageType>) => void;
  onCommit: () => void;
  onDragStart: (e: React.PointerEvent) => void;
}

export function ImageElement({ element, isSelected, scale, onSelect, onResize, onCommit, onDragStart }: Props) {
  const startRef = useRef<{ mouseX: number; mouseY: number; w: number; h: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect();
    onDragStart(e);
  };

  const handleResizeDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    startRef.current = { mouseX: e.clientX, mouseY: e.clientY, w: element.width, h: element.height };
  };

  const handleResizeMove = (e: React.PointerEvent) => {
    if (!startRef.current) return;
    const dx = (e.clientX - startRef.current.mouseX) / scale;
    const dy = (e.clientY - startRef.current.mouseY) / scale;
    const ratio = element.naturalWidth / element.naturalHeight;
    const newW = Math.max(40, startRef.current.w + dx);
    const newH = e.shiftKey ? newW / ratio : Math.max(30, startRef.current.h + dy);
    onResize({ width: newW, height: newH });
  };

  const handleResizeUp = () => {
    startRef.current = null;
    onCommit();
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        borderRadius: 6,
        outline: isSelected ? '2px solid #4A90E2' : '2px solid transparent',
        outlineOffset: 2,
        cursor: 'grab',
      }}
      onPointerDown={handlePointerDown}
    >
      <img
        src={element.src}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6, display: 'block', pointerEvents: 'none' }}
        draggable={false}
      />

      {isSelected && (
        <div
          style={{
            position: 'absolute',
            bottom: -6,
            right: -6,
            width: 14,
            height: 14,
            background: '#4A90E2',
            border: '2px solid white',
            borderRadius: '50%',
            cursor: 'nwse-resize',
            touchAction: 'none',
          }}
          onPointerDown={handleResizeDown}
          onPointerMove={handleResizeMove}
          onPointerUp={handleResizeUp}
        />
      )}
    </div>
  );
}
