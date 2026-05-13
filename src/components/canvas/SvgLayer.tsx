import { getStroke } from 'perfect-freehand';
import {
  CanvasElement,
  DrawingElement,
  FrameElement,
  ConnectorElement,
  Transform,
} from '../../types/canvas';
import { ConnectorSvg } from './elements/ConnectorSvg';

interface SvgLayerProps {
  elements: CanvasElement[];
  currentDrawing: DrawingElement | null;
  selectionBox: { x: number; y: number; width: number; height: number } | null;
  selectedIds: Set<string>;
  transform: Transform;
}

export function SvgLayer({ elements, currentDrawing, selectionBox, selectedIds, transform }: SvgLayerProps) {
  const { scale, tx, ty } = transform;

  const drawings = elements.filter((e): e is DrawingElement => e.elementType === 'drawing');
  const frames = elements.filter((e): e is FrameElement => e.elementType === 'frame');
  const connectors = elements.filter((e): e is ConnectorElement => e.elementType === 'connector');

  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(circle, #e5e7f0 1px, transparent 1px)',
        backgroundSize: `${20 * scale}px ${20 * scale}px`,
        backgroundPosition: `${tx}px ${ty}px`,
      }}
    >
      <defs>
        <pattern id="dots" x={tx % (20 * scale)} y={ty % (20 * scale)} width={20 * scale} height={20 * scale} patternUnits="userSpaceOnUse">
          <circle cx={1} cy={1} r={1} fill="#d1d5e8" />
        </pattern>
      </defs>
      <g transform={`translate(${tx}, ${ty}) scale(${scale})`}>
        {/* Frames first (behind everything) */}
        {frames.map(f => <FrameSvg key={f.id} frame={f} isSelected={selectedIds.has(f.id)} scale={scale} />)}

        {/* Connectors */}
        {connectors.map(c => (
          <ConnectorSvg
            key={c.id}
            connector={c}
            elements={elements}
            isSelected={selectedIds.has(c.id)}
            scale={scale}
          />
        ))}

        {/* Drawing shapes */}
        {drawings.map(d => <DrawingSvg key={d.id} shape={d} isSelected={selectedIds.has(d.id)} scale={scale} />)}

        {/* Current in-progress drawing */}
        {currentDrawing && <DrawingSvg shape={currentDrawing} isSelected={false} scale={scale} />}

        {/* Selection box */}
        {selectionBox && (
          <rect
            x={Math.min(selectionBox.x, selectionBox.x + selectionBox.width)}
            y={Math.min(selectionBox.y, selectionBox.y + selectionBox.height)}
            width={Math.abs(selectionBox.width)}
            height={Math.abs(selectionBox.height)}
            stroke="#4A90E2"
            strokeWidth={2 / scale}
            fill="rgba(74,144,226,0.08)"
            strokeDasharray={`${8 / scale} ${4 / scale}`}
          />
        )}
      </g>
    </svg>
  );
}

// ─── Frame ────────────────────────────────────────────────────────────────────

function FrameSvg({ frame, isSelected, scale }: { frame: FrameElement; isSelected: boolean; scale: number }) {
  return (
    <g>
      <rect
        x={frame.x}
        y={frame.y}
        width={frame.width}
        height={frame.height}
        fill={frame.backgroundColor}
        stroke={isSelected ? '#4A90E2' : frame.borderColor}
        strokeWidth={2 / scale}
        strokeDasharray={`${10 / scale} ${5 / scale}`}
        rx={4 / scale}
      />
      <text
        x={frame.x + 8 / scale}
        y={frame.y - 6 / scale}
        fontSize={13 / scale}
        fontFamily="'Gaegu', sans-serif"
        fill="#474747"
        fontWeight="bold"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {frame.label}
      </text>
    </g>
  );
}

// ─── Drawing shapes ───────────────────────────────────────────────────────────

function getSvgPath(stroke: number[][]): string {
  if (!stroke.length) return '';
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q'] as (string | number)[]
  );
  d.push('Z');
  return d.join(' ');
}

function DrawingSvg({ shape, isSelected, scale }: { shape: DrawingElement; isSelected: boolean; scale: number }) {
  const common = {
    stroke: shape.strokeColor,
    strokeWidth: shape.strokeWidth,
    fill: shape.fillColor || 'transparent',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const selStroke = {
    stroke: '#4A90E2',
    strokeWidth: 3 / scale,
    fill: 'none',
    strokeDasharray: `${8 / scale} ${4 / scale}`,
  };

  if (shape.drawingType === 'pen') {
    let pathData = shape.pathData;
    if (!pathData && shape.points && shape.points.length > 1) {
      const stroke = getStroke(shape.points, { size: (shape.strokeWidth || 2) * 2, thinning: 0.5, smoothing: 0.5, streamline: 0.5 });
      pathData = getSvgPath(stroke);
    }
    if (!pathData) return null;
    return (
      <g>
        <path d={pathData} fill={shape.strokeColor} stroke="none" />
        {isSelected && <path d={pathData} {...selStroke} />}
      </g>
    );
  }

  if (shape.drawingType === 'rectangle') {
    return (
      <g>
        <rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} {...common} />
        {isSelected && <rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} {...selStroke} />}
      </g>
    );
  }

  if (shape.drawingType === 'ellipse') {
    const rx = shape.rx ?? shape.width / 2;
    const ry = shape.ry ?? shape.height / 2;
    return (
      <g>
        <ellipse cx={shape.x} cy={shape.y} rx={rx} ry={ry} {...common} />
        {isSelected && <ellipse cx={shape.x} cy={shape.y} rx={rx} ry={ry} {...selStroke} />}
      </g>
    );
  }

  if (shape.drawingType === 'line') {
    const x2 = shape.x2 ?? shape.x + shape.width;
    const y2 = shape.y2 ?? shape.y + shape.height;
    return (
      <g>
        <line x1={shape.x} y1={shape.y} x2={x2} y2={y2} {...common} />
        {isSelected && (
          <>
            <line x1={shape.x} y1={shape.y} x2={x2} y2={y2} stroke="#4A90E2" strokeWidth={8 / scale} opacity={0.3} />
            <circle cx={shape.x} cy={shape.y} r={6 / scale} fill="#4A90E2" stroke="white" strokeWidth={2 / scale} />
            <circle cx={x2} cy={y2} r={6 / scale} fill="#4A90E2" stroke="white" strokeWidth={2 / scale} />
          </>
        )}
      </g>
    );
  }

  if (shape.drawingType === 'arrow') {
    const x2 = shape.x2 ?? shape.x + shape.width;
    const y2 = shape.y2 ?? shape.y + shape.height;
    const angle = Math.atan2(y2 - shape.y, x2 - shape.x);
    const arrowSize = 15;
    return (
      <g>
        <line x1={shape.x} y1={shape.y} x2={x2} y2={y2} {...common} />
        <polygon
          points={`0,0 ${-arrowSize},${arrowSize / 2} ${-arrowSize},${-arrowSize / 2}`}
          fill={shape.strokeColor}
          transform={`translate(${x2}, ${y2}) rotate(${(angle * 180) / Math.PI})`}
        />
        {isSelected && (
          <>
            <line x1={shape.x} y1={shape.y} x2={x2} y2={y2} stroke="#4A90E2" strokeWidth={8 / scale} opacity={0.3} />
            <circle cx={shape.x} cy={shape.y} r={6 / scale} fill="#4A90E2" stroke="white" strokeWidth={2 / scale} />
            <circle cx={x2} cy={y2} r={6 / scale} fill="#4A90E2" stroke="white" strokeWidth={2 / scale} />
          </>
        )}
      </g>
    );
  }

  if (shape.drawingType === 'triangle') {
    const w = shape.width, h = shape.height;
    const pts = `${shape.x + w / 2},${shape.y} ${shape.x + w},${shape.y + h} ${shape.x},${shape.y + h}`;
    return (
      <g>
        <polygon points={pts} {...common} />
        {isSelected && <polygon points={pts} {...selStroke} />}
      </g>
    );
  }

  if (shape.drawingType === 'star') {
    const sz = shape.size ?? 50;
    const pts = Array.from({ length: 10 }, (_, i) => {
      const ang = (i * Math.PI) / 5 - Math.PI / 2;
      const r = i % 2 === 0 ? sz : sz / 2;
      return `${shape.x + Math.cos(ang) * r},${shape.y + Math.sin(ang) * r}`;
    }).join(' ');
    return (
      <g>
        <polygon points={pts} {...common} />
        {isSelected && <circle cx={shape.x} cy={shape.y} r={sz} {...selStroke} />}
      </g>
    );
  }

  if (shape.drawingType === 'hexagon') {
    const sz = shape.size ?? 50;
    const pts = Array.from({ length: 6 }, (_, i) => {
      const ang = (i * Math.PI) / 3;
      return `${shape.x + Math.cos(ang) * sz},${shape.y + Math.sin(ang) * sz}`;
    }).join(' ');
    return (
      <g>
        <polygon points={pts} {...common} />
        {isSelected && <circle cx={shape.x} cy={shape.y} r={sz} {...selStroke} />}
      </g>
    );
  }

  return null;
}
