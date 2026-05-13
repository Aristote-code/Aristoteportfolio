export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface Transform {
  scale: number;
  tx: number;
  ty: number;
}

export type AnchorSide = 'top' | 'right' | 'bottom' | 'left';

export type DrawingToolType =
  | 'pen'
  | 'rectangle'
  | 'ellipse'
  | 'line'
  | 'arrow'
  | 'triangle'
  | 'star'
  | 'hexagon';

export type ToolType =
  | 'select'
  | 'pen'
  | 'rectangle'
  | 'ellipse'
  | 'line'
  | 'arrow'
  | 'triangle'
  | 'star'
  | 'hexagon'
  | 'sticky'
  | 'text'
  | 'image'
  | 'video'
  | 'frame'
  | 'connector'
  | 'emoji';

interface BaseCanvasElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

// ─── SVG-rendered elements ────────────────────────────────────────────────────

export interface DrawingElement extends BaseCanvasElement {
  elementType: 'drawing';
  drawingType: DrawingToolType;
  strokeColor: string;
  strokeWidth: number;
  fillColor?: string;
  // pen
  points?: Point[];
  pathData?: string;
  // two-point shapes (line / arrow)
  x2?: number;
  y2?: number;
  // size-based (star / hexagon)
  size?: number;
  // ellipse
  rx?: number;
  ry?: number;
}

export interface FrameElement extends BaseCanvasElement {
  elementType: 'frame';
  label: string;
  backgroundColor: string;
  borderColor: string;
  childIds: string[];
}

export interface ConnectorElement extends BaseCanvasElement {
  elementType: 'connector';
  fromId: string;
  toId: string;
  fromAnchor: AnchorSide;
  toAnchor: AnchorSide;
  pathType: 'straight' | 'elbow' | 'curved';
  strokeColor: string;
  strokeWidth: number;
  label?: string;
}

// ─── HTML-rendered elements ───────────────────────────────────────────────────

export interface StickyNoteElement extends BaseCanvasElement {
  elementType: 'sticky';
  text: string;
  color: 'yellow' | 'green' | 'pink' | 'blue' | 'purple' | 'cyan' | 'orange';
  fontSize: number;
}

export interface TextBoxElement extends BaseCanvasElement {
  elementType: 'text';
  content: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  color: string;
  align: 'left' | 'center' | 'right';
}

export interface ImageElement extends BaseCanvasElement {
  elementType: 'image';
  src: string;
  naturalWidth: number;
  naturalHeight: number;
}

export interface VideoElement extends BaseCanvasElement {
  elementType: 'video';
  videoType: 'youtube' | 'loom' | 'vimeo';
  embedUrl: string;
  label?: string;
}

export interface EmojiElement extends BaseCanvasElement {
  elementType: 'emoji';
  emoji: string;
  size: number;
}

// ─── Union ────────────────────────────────────────────────────────────────────

export type CanvasElement =
  | DrawingElement
  | FrameElement
  | ConnectorElement
  | StickyNoteElement
  | TextBoxElement
  | ImageElement
  | VideoElement
  | EmojiElement;

// Helpers
export function getBoundingBox(el: CanvasElement): { x: number; y: number; width: number; height: number } {
  return { x: el.x, y: el.y, width: el.width, height: el.height };
}

export function getAnchorPoint(el: CanvasElement, side: AnchorSide): Point {
  switch (side) {
    case 'top':    return { x: el.x + el.width / 2, y: el.y };
    case 'bottom': return { x: el.x + el.width / 2, y: el.y + el.height };
    case 'left':   return { x: el.x, y: el.y + el.height / 2 };
    case 'right':  return { x: el.x + el.width, y: el.y + el.height / 2 };
  }
}
