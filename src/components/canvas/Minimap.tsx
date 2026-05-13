import { useRef, useEffect } from 'react';
import { CanvasElement, Transform } from '../../types/canvas';

const W = 160;
const H = 100;
const PAD = 20;

const ELEMENT_COLORS: Record<string, string> = {
  drawing: '#8774ff',
  sticky: '#facc15',
  text: '#60a5fa',
  video: '#f472b6',
  image: '#4ade80',
  frame: '#e5e7f0',
  connector: '#94a3b8',
  emoji: '#fb923c',
};

interface MinimapProps {
  elements: CanvasElement[];
  transform: Transform;
  viewportSize: { width: number; height: number };
  onNavigate: (tx: number, ty: number) => void;
}

export function Minimap({ elements, transform, viewportSize, onNavigate }: MinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scale, tx, ty } = transform;

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#f8f9fc';
    ctx.fillRect(0, 0, W, H);

    if (elements.length === 0) {
      return;
    }

    // Compute world bounding box
    const allBounds = elements.map(e => ({
      minX: e.x, minY: e.y, maxX: e.x + e.width, maxY: e.y + e.height,
    }));
    const worldMinX = Math.min(...allBounds.map(b => b.minX));
    const worldMinY = Math.min(...allBounds.map(b => b.minY));
    const worldMaxX = Math.max(...allBounds.map(b => b.maxX));
    const worldMaxY = Math.max(...allBounds.map(b => b.maxY));
    const worldW = worldMaxX - worldMinX || 400;
    const worldH = worldMaxY - worldMinY || 300;

    const mmScale = Math.min((W - PAD * 2) / worldW, (H - PAD * 2) / worldH);
    const offX = PAD - worldMinX * mmScale;
    const offY = PAD - worldMinY * mmScale;

    // Draw elements
    for (const el of elements) {
      ctx.fillStyle = ELEMENT_COLORS[el.elementType] ?? '#8774ff';
      ctx.globalAlpha = 0.7;
      ctx.fillRect(
        el.x * mmScale + offX,
        el.y * mmScale + offY,
        Math.max(4, el.width * mmScale),
        Math.max(4, el.height * mmScale)
      );
    }
    ctx.globalAlpha = 1;

    // Draw viewport rect (what main canvas is showing)
    const vpX = -tx / scale;
    const vpY = -ty / scale;
    const vpW = viewportSize.width / scale;
    const vpH = viewportSize.height / scale;

    ctx.strokeStyle = '#4A90E2';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(
      vpX * mmScale + offX,
      vpY * mmScale + offY,
      vpW * mmScale,
      vpH * mmScale
    );
    ctx.fillStyle = 'rgba(74,144,226,0.08)';
    ctx.fillRect(
      vpX * mmScale + offX,
      vpY * mmScale + offY,
      vpW * mmScale,
      vpH * mmScale
    );
  }, [elements, transform, viewportSize]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (elements.length === 0) return;

    const allBounds = elements.map(el => ({
      minX: el.x, minY: el.y, maxX: el.x + el.width, maxY: el.y + el.height,
    }));
    const worldMinX = Math.min(...allBounds.map(b => b.minX));
    const worldMinY = Math.min(...allBounds.map(b => b.minY));
    const worldMaxX = Math.max(...allBounds.map(b => b.maxX));
    const worldMaxY = Math.max(...allBounds.map(b => b.maxY));
    const worldW = worldMaxX - worldMinX || 400;
    const worldH = worldMaxY - worldMinY || 300;
    const mmScale = Math.min((W - PAD * 2) / worldW, (H - PAD * 2) / worldH);
    const offX = PAD - worldMinX * mmScale;
    const offY = PAD - worldMinY * mmScale;

    // Convert minimap click to world center, then pan main canvas to center on that point
    const worldX = (mx - offX) / mmScale;
    const worldY = (my - offY) / mmScale;
    const newTx = viewportSize.width / 2 - worldX * scale;
    const newTy = viewportSize.height / 2 - worldY * scale;
    onNavigate(newTx, newTy);
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 16,
        borderRadius: 10,
        overflow: 'hidden',
        border: '1px solid #e5e7f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        background: 'white',
        zIndex: 20,
      }}
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ display: 'block', cursor: 'crosshair' }}
        onClick={handleClick}
      />
    </div>
  );
}

