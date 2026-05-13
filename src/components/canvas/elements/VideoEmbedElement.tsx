import { useState } from 'react';
import { VideoElement } from '../../../types/canvas';
import { Play } from 'lucide-react';

interface Props {
  element: VideoElement;
  isSelected: boolean;
  scale: number;
  onSelect: () => void;
  onDragStart: (e: React.PointerEvent) => void;
}

export function VideoEmbedElement({ element, isSelected, scale, onSelect, onDragStart }: Props) {
  // idle → selected → interacting
  const [interacting, setInteracting] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (interacting) { e.stopPropagation(); return; }
    onSelect();
    onDragStart(e);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) setInteracting(true);
  };

  // When clicking outside (losing focus via blur of the wrapper) reset interacting
  const handleBlur = () => setInteracting(false);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden',
        border: isSelected ? '2px solid #4A90E2' : '2px solid #e5e7f0',
        boxShadow: isSelected
          ? '0 0 0 3px rgba(74,144,226,0.25), 0 8px 24px rgba(0,0,0,0.12)'
          : '0 4px 16px rgba(0,0,0,0.1)',
        background: '#000',
        outline: 'none',
      }}
      tabIndex={-1}
      onBlur={handleBlur}
    >
      <iframe
        src={element.embedUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
          pointerEvents: interacting ? 'auto' : 'none',
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        title={element.label || 'Embedded video'}
      />

      {/* Overlay when not interacting */}
      {!interacting && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            cursor: isSelected ? 'default' : 'grab',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isSelected ? 'transparent' : 'rgba(0,0,0,0.08)',
          }}
          onPointerDown={handlePointerDown}
          onDoubleClick={handleDoubleClick}
        >
          {isSelected && (
            <div style={{
              background: 'rgba(255,255,255,0.9)',
              borderRadius: 20,
              padding: '6px 14px',
              fontSize: 12,
              color: '#474747',
              fontFamily: "'Gaegu', sans-serif",
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <Play size={13} />
              Double-click to interact
            </div>
          )}
        </div>
      )}

      {/* Label below (if any) */}
      {element.label && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,0.55)',
          color: 'white',
          fontSize: Math.max(10, 13 * scale),
          fontFamily: "'Gaegu', sans-serif",
          padding: '4px 10px',
          pointerEvents: 'none',
        }}>
          {element.label}
        </div>
      )}
    </div>
  );
}
