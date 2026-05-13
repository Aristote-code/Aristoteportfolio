import {
  MousePointer2, Pencil, Square, Circle, Triangle, Star, Hexagon,
  Minus, ArrowRight, StickyNote, Type, ImageIcon, Video, GitFork,
  LayoutTemplate, Undo2, Redo2, Trash2, X,
} from 'lucide-react';
import { ToolType } from '../../../types/canvas';
import { VideoInsertDialog } from './VideoInsertDialog';
import { EmojiPicker } from './EmojiPicker';
import { ParsedVideo } from '../../../utils/canvas/videoParser';

interface CanvasToolbarProps {
  tool: ToolType;
  setTool: (t: ToolType) => void;
  strokeColor: string;
  setStrokeColor: (c: string) => void;
  fillColor: string;
  setFillColor: (c: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onClose: () => void;
  onInsertVideo: (parsed: ParsedVideo, w: number, h: number) => void;
  onInsertImage: () => void;
  onSelectEmoji: (emoji: string) => void;
}

const STROKE_COLORS = ['#474747', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#b19cd9', '#8774ff', '#2d3748'];
const FILL_COLORS = ['transparent', '#ffffff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#b19cd9', '#8774ff'];

export function CanvasToolbar({
  tool, setTool,
  strokeColor, setStrokeColor,
  fillColor, setFillColor,
  canUndo, canRedo, hasSelection,
  onUndo, onRedo, onDelete, onClose,
  onInsertVideo, onInsertImage, onSelectEmoji,
}: CanvasToolbarProps) {
  const drawingTools: { icon: any; t: ToolType; tip: string }[] = [
    { icon: MousePointer2, t: 'select',    tip: 'Select (V)' },
    { icon: Pencil,        t: 'pen',       tip: 'Pen (P)' },
    { icon: Square,        t: 'rectangle', tip: 'Rectangle (R)' },
    { icon: Circle,        t: 'ellipse',   tip: 'Ellipse (O)' },
    { icon: Triangle,      t: 'triangle',  tip: 'Triangle' },
    { icon: Star,          t: 'star',      tip: 'Star' },
    { icon: Hexagon,       t: 'hexagon',   tip: 'Hexagon' },
    { icon: Minus,         t: 'line',      tip: 'Line (L)' },
    { icon: ArrowRight,    t: 'arrow',     tip: 'Arrow (A)' },
    { icon: GitFork,       t: 'connector', tip: 'Connector (C)' },
  ];

  const contentTools: { icon: any; t: ToolType; tip: string }[] = [
    { icon: StickyNote, t: 'sticky', tip: 'Sticky note (S)' },
    { icon: Type,       t: 'text',   tip: 'Text box (T)' },
    { icon: LayoutTemplate, t: 'frame', tip: 'Frame / Section (F)' },
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'white',
      borderRadius: 18,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      border: '1px solid #e5e7f0',
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      zIndex: 20,
      flexWrap: 'wrap',
      maxWidth: 'calc(100vw - 40px)',
    }}>
      {/* Drawing tools */}
      {drawingTools.map(({ icon, t, tip }) => (
        <TBtn key={t} icon={icon} active={tool === t} onClick={() => setTool(t)} tooltip={tip} />
      ))}

      <Sep />

      {/* Content tools */}
      {contentTools.map(({ icon, t, tip }) => (
        <TBtn key={t} icon={icon} active={tool === t} onClick={() => setTool(t)} tooltip={tip} />
      ))}

      {/* Image insert */}
      <TBtn icon={ImageIcon} active={tool === 'image'} onClick={onInsertImage} tooltip="Insert image (I)" />

      {/* Video insert */}
      <VideoInsertDialog onInsert={onInsertVideo}>
        <TBtn icon={Video} active={tool === 'video'} onClick={() => {}} tooltip="Embed video (E)" />
      </VideoInsertDialog>

      {/* Emoji */}
      <EmojiPicker onSelect={onSelectEmoji} active={tool === 'emoji'} />

      <Sep />

      {/* Colors */}
      <ColorPicker label="Stroke" color={strokeColor} colors={STROKE_COLORS} onChange={setStrokeColor} transparent={false} />
      <ColorPicker label="Fill" color={fillColor} colors={FILL_COLORS} onChange={setFillColor} transparent />

      <Sep />

      {/* Actions */}
      <TBtn icon={Undo2}  onClick={onUndo}   disabled={!canUndo}    tooltip="Undo (⌘Z)" />
      <TBtn icon={Redo2}  onClick={onRedo}   disabled={!canRedo}    tooltip="Redo (⌘⇧Z)" />
      <TBtn icon={Trash2} onClick={onDelete} disabled={!hasSelection} tooltip="Delete" />

      <Sep />

      <TBtn icon={X} onClick={onClose} tooltip="Close (Esc)" />
    </div>
  );
}

function Sep() {
  return <div style={{ width: 1, height: 24, background: '#e5e7f0', margin: '0 2px', flexShrink: 0 }} />;
}

function TBtn({ icon: Icon, active, onClick, disabled, tooltip }: {
  icon: any; active?: boolean; onClick: () => void; disabled?: boolean; tooltip?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 8,
        border: 'none',
        background: active ? '#8774ff' : 'transparent',
        color: active ? 'white' : disabled ? '#c5c7d8' : '#474747',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
        flexShrink: 0,
      }}
      onMouseEnter={e => { if (!active && !disabled) e.currentTarget.style.background = '#f3f4f6'; }}
      onMouseLeave={e => { if (!active && !disabled) e.currentTarget.style.background = 'transparent'; }}
    >
      <Icon size={18} />
    </button>
  );
}

function ColorPicker({
  label, color, colors, onChange, transparent,
}: {
  label: string; color: string; colors: string[]; onChange: (c: string) => void; transparent: boolean;
}) {
  return (
    <div style={{ position: 'relative' }} className="color-picker-button">
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '6px 10px',
          borderRadius: 8,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          color: '#8c8fa6',
          fontSize: 12,
          fontFamily: "'Gaegu', cursive",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        onClick={e => {
          const popup = e.currentTarget.nextElementSibling as HTMLElement | null;
          if (popup) popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
        }}
      >
        <div style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: '2px solid #d1d5db',
          background: color === 'transparent'
            ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, white 25%, white 75%, #ccc 75%, #ccc)'
            : color,
          backgroundSize: color === 'transparent' ? '6px 6px' : 'auto',
          backgroundPosition: color === 'transparent' ? '0 0, 3px 3px' : 'auto',
          flexShrink: 0,
        }} />
        {label}
      </button>
      <div
        className="color-picker-popup"
        style={{
          display: 'none',
          position: 'absolute',
          bottom: '100%',
          left: 0,
          marginBottom: 8,
          background: 'white',
          border: '1px solid #e5e7f0',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          padding: 10,
          flexDirection: 'column',
          gap: 6,
          zIndex: 100,
        }}
      >
        <span style={{ fontSize: 11, color: '#8c8fa6', fontFamily: "'Gaegu', cursive" }}>{label} Color</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {colors.map(c => (
            <button
              key={c}
              onClick={() => {
                onChange(c);
                const popup = (document.querySelectorAll('.color-picker-popup') as NodeListOf<HTMLElement>);
                popup.forEach(p => (p.style.display = 'none'));
              }}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: `2px solid ${color === c ? '#474747' : '#d1d5db'}`,
                outline: color === c ? '2px solid #8774ff' : 'none',
                outlineOffset: 1,
                background: c === 'transparent'
                  ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, white 25%, white 75%, #ccc 75%, #ccc)'
                  : c,
                backgroundSize: c === 'transparent' ? '6px 6px' : 'auto',
                backgroundPosition: c === 'transparent' ? '0 0, 3px 3px' : 'auto',
                cursor: 'pointer',
                transition: 'transform 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
