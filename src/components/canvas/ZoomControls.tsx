import { ZoomIn, ZoomOut, Maximize, Undo2 } from 'lucide-react';

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onZoomFit: () => void;
}

export function ZoomControls({ scale, onZoomIn, onZoomOut, onZoomReset, onZoomFit }: ZoomControlsProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        background: 'white',
        border: '1px solid #e5e7f0',
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        padding: '6px 4px',
        zIndex: 20,
      }}
    >
      <ZBtn onClick={onZoomIn} title="Zoom in (⌘+)"><ZoomIn size={15} /></ZBtn>
      <button
        onClick={onZoomReset}
        title="Reset zoom"
        style={{
          padding: '3px 8px',
          borderRadius: 6,
          border: 'none',
          background: 'transparent',
          fontSize: 11,
          color: '#474747',
          cursor: 'pointer',
          fontFamily: "'Figtree', sans-serif",
          fontWeight: 600,
          lineHeight: 1.4,
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {Math.round(scale * 100)}%
      </button>
      <ZBtn onClick={onZoomOut} title="Zoom out (⌘-)"><ZoomOut size={15} /></ZBtn>
      <div style={{ height: 1, background: '#e5e7f0', margin: '2px 4px' }} />
      <ZBtn onClick={onZoomFit} title="Fit all elements"><Maximize size={14} /></ZBtn>
      <ZBtn onClick={onZoomReset} title="Reset to 100%"><Undo2 size={14} /></ZBtn>
    </div>
  );
}

function ZBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 7,
        borderRadius: 7,
        border: 'none',
        background: 'transparent',
        color: '#474747',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </button>
  );
}
