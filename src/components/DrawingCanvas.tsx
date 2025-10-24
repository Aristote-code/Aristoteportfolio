import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pencil, 
  Square, 
  Circle, 
  Minus, 
  ArrowRight, 
  MousePointer2,
  Trash2,
  Undo2,
  Redo2,
  X,
  Triangle,
  Star,
  Hexagon,
  Palette,
} from 'lucide-react';
import { getStroke } from 'perfect-freehand';

// Shape types
type ToolType = 'select' | 'pen' | 'rectangle' | 'ellipse' | 'line' | 'arrow' | 'triangle' | 'star' | 'hexagon';

interface Point {
  x: number;
  y: number;
  pressure?: number;
}

interface BaseShape {
  id: string;
  type: ToolType;
  x: number;
  y: number;
  strokeColor: string;
  strokeWidth: number;
  fillColor?: string;
}

interface PenShape extends BaseShape {
  type: 'pen';
  points: Point[];
  pathData?: string;
}

interface RectangleShape extends BaseShape {
  type: 'rectangle';
  width: number;
  height: number;
}

interface EllipseShape extends BaseShape {
  type: 'ellipse';
  rx: number;
  ry: number;
}

interface LineShape extends BaseShape {
  type: 'line';
  x2: number;
  y2: number;
}

interface ArrowShape extends BaseShape {
  type: 'arrow';
  x2: number;
  y2: number;
}

interface TriangleShape extends BaseShape {
  type: 'triangle';
  width: number;
  height: number;
}

interface StarShape extends BaseShape {
  type: 'star';
  size: number;
}

interface HexagonShape extends BaseShape {
  type: 'hexagon';
  size: number;
}

type Shape = PenShape | RectangleShape | EllipseShape | LineShape | ArrowShape | TriangleShape | StarShape | HexagonShape;

interface Transform {
  scale: number;
  tx: number;
  ty: number;
}

interface DrawingCanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DrawingCanvas({ isOpen, onClose }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [tool, setTool] = useState<ToolType>('pen');
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [history, setHistory] = useState<Shape[][]>([[]]);
  const [historyStep, setHistoryStep] = useState(0);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [transform, setTransform] = useState<Transform>({ scale: 1, tx: 0, ty: 0 });
  const [strokeColor, setStrokeColor] = useState('#474747');
  const [fillColor, setFillColor] = useState('transparent');
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [showStrokeColors, setShowStrokeColors] = useState(false);
  const [showFillColors, setShowFillColors] = useState(false);

  // Convert screen coordinates to world coordinates
  const screenToWorld = useCallback((x: number, y: number): Point => {
    return {
      x: (x - transform.tx) / transform.scale,
      y: (y - transform.ty) / transform.scale,
    };
  }, [transform]);

  // Get pointer position
  const getPointerPos = (e: React.PointerEvent | PointerEvent): Point => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Add to history
  const addToHistory = useCallback((newShapes: Shape[]) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push([...newShapes]);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
    setShapes(newShapes);
  }, [history, historyStep]);

  // Undo
  const undo = useCallback(() => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setShapes([...history[historyStep - 1]]);
      setSelectedShapeId(null);
    }
  }, [history, historyStep]);

  // Redo
  const redo = useCallback(() => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setShapes([...history[historyStep + 1]]);
      setSelectedShapeId(null);
    }
  }, [history, historyStep]);

  // Delete selected shape
  const deleteSelected = useCallback(() => {
    if (selectedShapeId) {
      const newShapes = shapes.filter(s => s.id !== selectedShapeId);
      addToHistory(newShapes);
      setSelectedShapeId(null);
    }
  }, [selectedShapeId, shapes, addToHistory]);

  // Check if shape is in selection box
  const isShapeInSelectionBox = (shape: Shape, box: { x: number; y: number; width: number; height: number }): boolean => {
    const minX = Math.min(box.x, box.x + box.width);
    const maxX = Math.max(box.x, box.x + box.width);
    const minY = Math.min(box.y, box.y + box.height);
    const maxY = Math.max(box.y, box.y + box.height);

    if (shape.type === 'line' || shape.type === 'arrow') {
      const line = shape as LineShape | ArrowShape;
      return (
        (line.x >= minX && line.x <= maxX && line.y >= minY && line.y <= maxY) ||
        (line.x2 >= minX && line.x2 <= maxX && line.y2 >= minY && line.y2 <= maxY)
      );
    } else {
      return shape.x >= minX && shape.x <= maxX && shape.y >= minY && shape.y <= maxY;
    }
  };

  // Hit test for selection - more precise
  const hitTest = useCallback((worldPoint: Point): Shape | null => {
    const tolerance = 8;
    
    // Iterate shapes in reverse (top to bottom)
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      
      if (shape.type === 'rectangle') {
        const rect = shape as RectangleShape;
        if (
          worldPoint.x >= rect.x - tolerance &&
          worldPoint.x <= rect.x + rect.width + tolerance &&
          worldPoint.y >= rect.y - tolerance &&
          worldPoint.y <= rect.y + rect.height + tolerance
        ) {
          return shape;
        }
      } else if (shape.type === 'ellipse') {
        const ellipse = shape as EllipseShape;
        const dx = (worldPoint.x - ellipse.x) / (ellipse.rx + tolerance);
        const dy = (worldPoint.y - ellipse.y) / (ellipse.ry + tolerance);
        if (dx * dx + dy * dy <= 1) {
          return shape;
        }
      } else if (shape.type === 'line' || shape.type === 'arrow') {
        const line = shape as LineShape | ArrowShape;
        const dist = distanceToLineSegment(worldPoint, { x: line.x, y: line.y }, { x: line.x2, y: line.y2 });
        if (dist < tolerance) {
          return shape;
        }
      } else if (shape.type === 'triangle') {
        const tri = shape as TriangleShape;
        if (
          worldPoint.x >= tri.x - tolerance &&
          worldPoint.x <= tri.x + tri.width + tolerance &&
          worldPoint.y >= tri.y - tolerance &&
          worldPoint.y <= tri.y + tri.height + tolerance
        ) {
          return shape;
        }
      } else if (shape.type === 'star' || shape.type === 'hexagon') {
        const sized = shape as StarShape | HexagonShape;
        const dist = Math.hypot(worldPoint.x - sized.x, worldPoint.y - sized.y);
        if (dist < sized.size + tolerance) {
          return shape;
        }
      } else if (shape.type === 'pen') {
        const pen = shape as PenShape;
        const xs = pen.points.map(p => p.x);
        const ys = pen.points.map(p => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        
        if (
          worldPoint.x >= minX - tolerance &&
          worldPoint.x <= maxX + tolerance &&
          worldPoint.y >= minY - tolerance &&
          worldPoint.y <= maxY + tolerance
        ) {
          return shape;
        }
      }
    }
    
    return null;
  }, [shapes]);

  // Distance from point to line segment
  const distanceToLineSegment = (p: Point, a: Point, b: Point): number => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lengthSq = dx * dx + dy * dy;
    
    if (lengthSq === 0) return Math.hypot(p.x - a.x, p.y - a.y);
    
    let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSq;
    t = Math.max(0, Math.min(1, t));
    
    const projX = a.x + t * dx;
    const projY = a.y + t * dy;
    
    return Math.hypot(p.x - projX, p.y - projY);
  };

  // Handle pointer down
  const handlePointerDown = (e: React.PointerEvent) => {
    const pos = getPointerPos(e);
    const worldPos = screenToWorld(pos.x, pos.y);

    // Pan with space key
    if (isSpacePressed) {
      setIsPanning(true);
      setDragStart(pos);
      return;
    }

    if (tool === 'select') {
      const hitShape = hitTest(worldPos);
      if (hitShape) {
        setSelectedShapeId(hitShape.id);
        setDragStart(worldPos);
      } else {
        // Start selection box
        setSelectedShapeId(null);
        setDragStart(worldPos);
        setSelectionBox({ x: worldPos.x, y: worldPos.y, width: 0, height: 0 });
      }
      return;
    }

    setIsDrawing(true);
    const id = `${Date.now()}-${Math.random()}`;

    if (tool === 'pen') {
      setCurrentShape({
        id,
        type: 'pen',
        x: worldPos.x,
        y: worldPos.y,
        points: [{ x: worldPos.x, y: worldPos.y }],
        strokeColor,
        strokeWidth: 2,
      } as PenShape);
    } else if (tool === 'rectangle') {
      setCurrentShape({
        id,
        type: 'rectangle',
        x: worldPos.x,
        y: worldPos.y,
        width: 0,
        height: 0,
        strokeColor,
        strokeWidth: 2,
        fillColor,
      } as RectangleShape);
    } else if (tool === 'ellipse') {
      setCurrentShape({
        id,
        type: 'ellipse',
        x: worldPos.x,
        y: worldPos.y,
        rx: 0,
        ry: 0,
        strokeColor,
        strokeWidth: 2,
        fillColor,
      } as EllipseShape);
    } else if (tool === 'line') {
      setCurrentShape({
        id,
        type: 'line',
        x: worldPos.x,
        y: worldPos.y,
        x2: worldPos.x,
        y2: worldPos.y,
        strokeColor,
        strokeWidth: 2,
      } as LineShape);
    } else if (tool === 'arrow') {
      setCurrentShape({
        id,
        type: 'arrow',
        x: worldPos.x,
        y: worldPos.y,
        x2: worldPos.x,
        y2: worldPos.y,
        strokeColor,
        strokeWidth: 2,
      } as ArrowShape);
    } else if (tool === 'triangle') {
      setCurrentShape({
        id,
        type: 'triangle',
        x: worldPos.x,
        y: worldPos.y,
        width: 0,
        height: 0,
        strokeColor,
        strokeWidth: 2,
        fillColor,
      } as TriangleShape);
    } else if (tool === 'star') {
      setCurrentShape({
        id,
        type: 'star',
        x: worldPos.x,
        y: worldPos.y,
        size: 0,
        strokeColor,
        strokeWidth: 2,
        fillColor,
      } as StarShape);
    } else if (tool === 'hexagon') {
      setCurrentShape({
        id,
        type: 'hexagon',
        x: worldPos.x,
        y: worldPos.y,
        size: 0,
        strokeColor,
        strokeWidth: 2,
        fillColor,
      } as HexagonShape);
    }

    setDragStart(worldPos);
  };

  // Handle pointer move
  const handlePointerMove = (e: React.PointerEvent) => {
    const pos = getPointerPos(e);
    const worldPos = screenToWorld(pos.x, pos.y);

    if (isPanning && dragStart) {
      setTransform(prev => ({
        ...prev,
        tx: prev.tx + (pos.x - dragStart.x),
        ty: prev.ty + (pos.y - dragStart.y),
      }));
      setDragStart(pos);
      return;
    }

    // Update selection box
    if (tool === 'select' && selectionBox && dragStart && !selectedShapeId) {
      setSelectionBox({
        x: dragStart.x,
        y: dragStart.y,
        width: worldPos.x - dragStart.x,
        height: worldPos.y - dragStart.y,
      });
      return;
    }

    // Move selected shape
    if (tool === 'select' && selectedShapeId && dragStart && !isDrawing) {
      const dx = worldPos.x - dragStart.x;
      const dy = worldPos.y - dragStart.y;
      
      setShapes(shapes.map(shape => {
        if (shape.id === selectedShapeId) {
          if (shape.type === 'line' || shape.type === 'arrow') {
            const line = shape as LineShape | ArrowShape;
            return {
              ...shape,
              x: shape.x + dx,
              y: shape.y + dy,
              x2: line.x2 + dx,
              y2: line.y2 + dy,
            };
          }
          return {
            ...shape,
            x: shape.x + dx,
            y: shape.y + dy,
          };
        }
        return shape;
      }));
      
      setDragStart(worldPos);
      return;
    }

    if (!isDrawing || !currentShape || !dragStart) return;

    if (tool === 'pen') {
      const penShape = currentShape as PenShape;
      setCurrentShape({
        ...penShape,
        points: [...penShape.points, { x: worldPos.x, y: worldPos.y }],
      });
    } else if (tool === 'rectangle') {
      const rectShape = currentShape as RectangleShape;
      const width = worldPos.x - dragStart.x;
      const height = worldPos.y - dragStart.y;
      
      const isSquare = e.shiftKey;
      const size = isSquare ? Math.max(Math.abs(width), Math.abs(height)) : 0;
      
      setCurrentShape({
        ...rectShape,
        x: width < 0 ? worldPos.x : dragStart.x,
        y: height < 0 ? worldPos.y : dragStart.y,
        width: isSquare ? size : Math.abs(width),
        height: isSquare ? size : Math.abs(height),
      });
    } else if (tool === 'ellipse') {
      const ellipseShape = currentShape as EllipseShape;
      const rx = Math.abs(worldPos.x - dragStart.x) / 2;
      const ry = Math.abs(worldPos.y - dragStart.y) / 2;
      
      const isCircle = e.shiftKey;
      const r = isCircle ? Math.max(rx, ry) : 0;
      
      setCurrentShape({
        ...ellipseShape,
        x: (worldPos.x + dragStart.x) / 2,
        y: (worldPos.y + dragStart.y) / 2,
        rx: isCircle ? r : rx,
        ry: isCircle ? r : ry,
      });
    } else if (tool === 'line' || tool === 'arrow') {
      const lineShape = currentShape as LineShape | ArrowShape;
      
      let x2 = worldPos.x;
      let y2 = worldPos.y;
      
      if (e.shiftKey) {
        const dx = x2 - dragStart.x;
        const dy = y2 - dragStart.y;
        const angle = Math.atan2(dy, dx);
        const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
        const dist = Math.hypot(dx, dy);
        x2 = dragStart.x + Math.cos(snapAngle) * dist;
        y2 = dragStart.y + Math.sin(snapAngle) * dist;
      }
      
      setCurrentShape({
        ...lineShape,
        x2,
        y2,
      });
    } else if (tool === 'triangle') {
      const triShape = currentShape as TriangleShape;
      const width = worldPos.x - dragStart.x;
      const height = worldPos.y - dragStart.y;
      
      setCurrentShape({
        ...triShape,
        x: width < 0 ? worldPos.x : dragStart.x,
        y: height < 0 ? worldPos.y : dragStart.y,
        width: Math.abs(width),
        height: Math.abs(height),
      });
    } else if (tool === 'star' || tool === 'hexagon') {
      const sizedShape = currentShape as StarShape | HexagonShape;
      const size = Math.hypot(worldPos.x - dragStart.x, worldPos.y - dragStart.y);
      
      setCurrentShape({
        ...sizedShape,
        size,
      });
    }
  };

  // Handle pointer up
  const handlePointerUp = () => {
    if (isPanning) {
      setIsPanning(false);
      setDragStart(null);
      return;
    }

    // Handle selection box
    if (tool === 'select' && selectionBox) {
      // Find shapes in selection box
      const selectedShapes = shapes.filter(shape => isShapeInSelectionBox(shape, selectionBox));
      if (selectedShapes.length > 0) {
        // Select the topmost shape
        setSelectedShapeId(selectedShapes[selectedShapes.length - 1].id);
      }
      setSelectionBox(null);
      setDragStart(null);
      return;
    }

    if (tool === 'select' && selectedShapeId && dragStart) {
      // Finalize move
      addToHistory(shapes);
      setDragStart(null);
      return;
    }

    if (isDrawing && currentShape) {
      let finalShape = currentShape;
      
      // Process pen strokes with perfect-freehand
      if (tool === 'pen') {
        const penShape = currentShape as PenShape;
        if (penShape.points.length > 1) {
          const stroke = getStroke(penShape.points, {
            size: penShape.strokeWidth * 2,
            thinning: 0.5,
            smoothing: 0.5,
            streamline: 0.5,
          });
          
          const pathData = getSvgPathFromStroke(stroke);
          finalShape = { ...penShape, pathData };
        }
      }
      
      // Only add if shape has meaningful size
      let shouldAdd = true;
      if (tool === 'rectangle' || tool === 'triangle') {
        const rect = finalShape as RectangleShape | TriangleShape;
        if (rect.width < 5 || rect.height < 5) shouldAdd = false;
      } else if (tool === 'ellipse') {
        const ellipse = finalShape as EllipseShape;
        if (ellipse.rx < 3 || ellipse.ry < 3) shouldAdd = false;
      } else if (tool === 'star' || tool === 'hexagon') {
        const sized = finalShape as StarShape | HexagonShape;
        if (sized.size < 10) shouldAdd = false;
      }
      
      if (shouldAdd) {
        addToHistory([...shapes, finalShape]);
      }
      setCurrentShape(null);
    }
    
    setIsDrawing(false);
    setDragStart(null);
  };

  // Convert stroke to SVG path
  const getSvgPathFromStroke = (stroke: number[][]): string => {
    if (!stroke.length) return '';
    
    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length];
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        return acc;
      },
      ['M', ...stroke[0], 'Q']
    );
    
    d.push('Z');
    return d.join(' ');
  };

  // Handle zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const pos = getPointerPos(e as any);
      
      setTransform(prev => {
        const newScale = Math.max(0.1, Math.min(5, prev.scale * delta));
        const scaleChange = newScale / prev.scale;
        
        return {
          scale: newScale,
          tx: pos.x - (pos.x - prev.tx) * scaleChange,
          ty: pos.y - (pos.y - prev.ty) * scaleChange,
        };
      });
    }
  };

  // Close color pickers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.color-picker-button') && !target.closest('.color-picker-popup')) {
        setShowStrokeColors(false);
        setShowFillColors(false);
      }
    };

    if (showStrokeColors || showFillColors) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showStrokeColors, showFillColors]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      // Undo/Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      
      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedShapeId) {
          e.preventDefault();
          deleteSelected();
        }
      }
      
      // Space for panning
      if (e.key === ' ' && !isSpacePressed) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
      
      // Tool shortcuts
      if (e.key === 'v') setTool('select');
      if (e.key === 'p') setTool('pen');
      if (e.key === 'r') setTool('rectangle');
      if (e.key === 'o') setTool('ellipse');
      if (e.key === 'l') setTool('line');
      if (e.key === 'a') setTool('arrow');
      
      // Escape
      if (e.key === 'Escape') {
        setSelectedShapeId(null);
        onClose();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, undo, redo, deleteSelected, selectedShapeId, onClose, isSpacePressed]);

  // Render shape
  const renderShape = (shape: Shape, isSelected: boolean = false) => {
    const commonProps = {
      stroke: shape.strokeColor,
      strokeWidth: shape.strokeWidth,
      fill: (shape as any).fillColor || 'transparent',
      strokeLinecap: 'round' as const,
      strokeLinejoin: 'round' as const,
    };

    if (shape.type === 'pen') {
      const pen = shape as PenShape;
      if (pen.pathData) {
        return (
          <g key={shape.id}>
            <path
              d={pen.pathData}
              fill={pen.strokeColor}
              stroke="none"
            />
            {isSelected && (
              <path
                d={pen.pathData}
                stroke="#4A90E2"
                strokeWidth={3}
                fill="none"
                strokeDasharray="5"
              />
            )}
          </g>
        );
      }
    } else if (shape.type === 'rectangle') {
      const rect = shape as RectangleShape;
      return (
        <g key={shape.id}>
          <rect
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            {...commonProps}
          />
          {isSelected && (
            <rect
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              stroke="#4A90E2"
              strokeWidth={3}
              fill="none"
              strokeDasharray="8 4"
            />
          )}
        </g>
      );
    } else if (shape.type === 'ellipse') {
      const ellipse = shape as EllipseShape;
      return (
        <g key={shape.id}>
          <ellipse
            cx={ellipse.x}
            cy={ellipse.y}
            rx={ellipse.rx}
            ry={ellipse.ry}
            {...commonProps}
          />
          {isSelected && (
            <ellipse
              cx={ellipse.x}
              cy={ellipse.y}
              rx={ellipse.rx}
              ry={ellipse.ry}
              stroke="#4A90E2"
              strokeWidth={3}
              fill="none"
              strokeDasharray="8 4"
            />
          )}
        </g>
      );
    } else if (shape.type === 'line') {
      const line = shape as LineShape;
      return (
        <g key={shape.id}>
          <line
            x1={line.x}
            y1={line.y}
            x2={line.x2}
            y2={line.y2}
            {...commonProps}
          />
          {isSelected && (
            <>
              <line
                x1={line.x}
                y1={line.y}
                x2={line.x2}
                y2={line.y2}
                stroke="#4A90E2"
                strokeWidth={8}
                opacity={0.3}
              />
              <circle cx={line.x} cy={line.y} r={6} fill="#4A90E2" stroke="white" strokeWidth={2} />
              <circle cx={line.x2} cy={line.y2} r={6} fill="#4A90E2" stroke="white" strokeWidth={2} />
            </>
          )}
        </g>
      );
    } else if (shape.type === 'arrow') {
      const arrow = shape as ArrowShape;
      const angle = Math.atan2(arrow.y2 - arrow.y, arrow.x2 - arrow.x);
      const arrowSize = 15;
      
      return (
        <g key={shape.id}>
          <line
            x1={arrow.x}
            y1={arrow.y}
            x2={arrow.x2}
            y2={arrow.y2}
            {...commonProps}
          />
          <polygon
            points={`0,0 ${-arrowSize},${arrowSize/2} ${-arrowSize},${-arrowSize/2}`}
            fill={arrow.strokeColor}
            transform={`translate(${arrow.x2}, ${arrow.y2}) rotate(${angle * 180 / Math.PI})`}
          />
          {isSelected && (
            <>
              <line
                x1={arrow.x}
                y1={arrow.y}
                x2={arrow.x2}
                y2={arrow.y2}
                stroke="#4A90E2"
                strokeWidth={8}
                opacity={0.3}
              />
              <circle cx={arrow.x} cy={arrow.y} r={6} fill="#4A90E2" stroke="white" strokeWidth={2} />
              <circle cx={arrow.x2} cy={arrow.y2} r={6} fill="#4A90E2" stroke="white" strokeWidth={2} />
            </>
          )}
        </g>
      );
    } else if (shape.type === 'triangle') {
      const tri = shape as TriangleShape;
      const points = `${tri.x + tri.width/2},${tri.y} ${tri.x + tri.width},${tri.y + tri.height} ${tri.x},${tri.y + tri.height}`;
      return (
        <g key={shape.id}>
          <polygon
            points={points}
            {...commonProps}
          />
          {isSelected && (
            <polygon
              points={points}
              stroke="#4A90E2"
              strokeWidth={3}
              fill="none"
              strokeDasharray="8 4"
            />
          )}
        </g>
      );
    } else if (shape.type === 'star') {
      const star = shape as StarShape;
      const points = Array.from({ length: 10 }, (_, i) => {
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const radius = i % 2 === 0 ? star.size : star.size / 2;
        return `${star.x + Math.cos(angle) * radius},${star.y + Math.sin(angle) * radius}`;
      }).join(' ');
      
      return (
        <g key={shape.id}>
          <polygon
            points={points}
            {...commonProps}
          />
          {isSelected && (
            <circle
              cx={star.x}
              cy={star.y}
              r={star.size}
              stroke="#4A90E2"
              strokeWidth={3}
              fill="none"
              strokeDasharray="8 4"
            />
          )}
        </g>
      );
    } else if (shape.type === 'hexagon') {
      const hex = shape as HexagonShape;
      const points = Array.from({ length: 6 }, (_, i) => {
        const angle = (i * Math.PI) / 3;
        return `${hex.x + Math.cos(angle) * hex.size},${hex.y + Math.sin(angle) * hex.size}`;
      }).join(' ');
      
      return (
        <g key={shape.id}>
          <polygon
            points={points}
            {...commonProps}
          />
          {isSelected && (
            <circle
              cx={hex.x}
              cy={hex.y}
              r={hex.size}
              stroke="#4A90E2"
              strokeWidth={3}
              fill="none"
              strokeDasharray="8 4"
            />
          )}
        </g>
      );
    }
    
    return null;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-white hidden md:block"
      >
        {/* Toolbar - Bottom positioned */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg border border-[#e5e7f0] px-4 py-3 flex items-center gap-2 z-10">
          {/* Tools */}
          <ToolButton icon={MousePointer2} active={tool === 'select'} onClick={() => setTool('select')} tooltip="Select (V)" />
          <ToolButton icon={Pencil} active={tool === 'pen'} onClick={() => setTool('pen')} tooltip="Pen (P)" />
          <ToolButton icon={Square} active={tool === 'rectangle'} onClick={() => setTool('rectangle')} tooltip="Rectangle (R)" />
          <ToolButton icon={Circle} active={tool === 'ellipse'} onClick={() => setTool('ellipse')} tooltip="Ellipse (O)" />
          <ToolButton icon={Triangle} active={tool === 'triangle'} onClick={() => setTool('triangle')} tooltip="Triangle" />
          <ToolButton icon={Star} active={tool === 'star'} onClick={() => setTool('star')} tooltip="Star" />
          <ToolButton icon={Hexagon} active={tool === 'hexagon'} onClick={() => setTool('hexagon')} tooltip="Hexagon" />
          <ToolButton icon={Minus} active={tool === 'line'} onClick={() => setTool('line')} tooltip="Line (L)" />
          <ToolButton icon={ArrowRight} active={tool === 'arrow'} onClick={() => setTool('arrow')} tooltip="Arrow (A)" />
          
          <div className="w-px h-6 bg-[#e5e7f0]" />
          
          {/* Stroke Color Button */}
          <div className="relative color-picker-button">
            <button
              onClick={() => {
                setShowStrokeColors(!showStrokeColors);
                setShowFillColors(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Stroke color"
            >
              <div className="flex items-center gap-1">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: strokeColor }}
                />
                <span className="text-[12px] text-[#8c8fa6] font-['Gaegu']">Stroke</span>
              </div>
            </button>
            
            {/* Stroke Color Picker Popup */}
            {showStrokeColors && (
              <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-[#e5e7f0] p-3 color-picker-popup">
                <div className="flex flex-col gap-2">
                  <span className="text-[12px] text-[#8c8fa6] font-['Gaegu']">Stroke Color</span>
                  <div className="flex gap-2">
                    {['#474747', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#b19cd9'].map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          setStrokeColor(color);
                          setShowStrokeColors(false);
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                          strokeColor === color ? 'border-[#474747] ring-2 ring-[#8774ff]' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Fill Color Button */}
          <div className="relative color-picker-button">
            <button
              onClick={() => {
                setShowFillColors(!showFillColors);
                setShowStrokeColors(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Fill color"
            >
              <div className="flex items-center gap-1">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-gray-300"
                  style={{ 
                    backgroundColor: fillColor === 'transparent' ? 'white' : fillColor,
                    background: fillColor === 'transparent' 
                      ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, white 25%, white 75%, #ccc 75%, #ccc)'
                      : fillColor,
                    backgroundSize: fillColor === 'transparent' ? '6px 6px' : 'auto',
                    backgroundPosition: fillColor === 'transparent' ? '0 0, 3px 3px' : 'auto'
                  }}
                />
                <span className="text-[12px] text-[#8c8fa6] font-['Gaegu']">Fill</span>
              </div>
            </button>
            
            {/* Fill Color Picker Popup */}
            {showFillColors && (
              <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-[#e5e7f0] p-3 color-picker-popup">
                <div className="flex flex-col gap-2">
                  <span className="text-[12px] text-[#8c8fa6] font-['Gaegu']">Fill Color</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setFillColor('transparent');
                        setShowFillColors(false);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                        fillColor === 'transparent' ? 'border-[#474747] ring-2 ring-[#8774ff]' : 'border-gray-300'
                      }`}
                      style={{ 
                        background: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, white 25%, white 75%, #ccc 75%, #ccc)',
                        backgroundSize: '6px 6px',
                        backgroundPosition: '0 0, 3px 3px'
                      }}
                      title="No fill"
                    />
                    {['#ffffff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#b19cd9'].map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          setFillColor(color);
                          setShowFillColors(false);
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                          fillColor === color ? 'border-[#474747] ring-2 ring-[#8774ff]' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="w-px h-6 bg-[#e5e7f0]" />
          
          {/* Actions */}
          <ToolButton icon={Undo2} onClick={undo} disabled={historyStep === 0} tooltip="Undo (⌘Z)" />
          <ToolButton icon={Redo2} onClick={redo} disabled={historyStep === history.length - 1} tooltip="Redo (⌘⇧Z)" />
          <ToolButton icon={Trash2} onClick={deleteSelected} disabled={!selectedShapeId} tooltip="Delete" />
          
          <div className="w-px h-6 bg-[#e5e7f0]" />
          
          <ToolButton icon={X} onClick={onClose} tooltip="Close (Esc)" />
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="w-full h-full overflow-hidden"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}
          style={{ 
            cursor: isPanning || isSpacePressed ? 'grab' : tool === 'select' ? 'default' : 'crosshair',
            touchAction: 'none',
          }}
        >
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            style={{
              background: 'radial-gradient(circle, #e5e7f0 1px, transparent 1px)',
              backgroundSize: `${20 * transform.scale}px ${20 * transform.scale}px`,
              backgroundPosition: `${transform.tx}px ${transform.ty}px`,
            }}
          >
            <g transform={`translate(${transform.tx}, ${transform.ty}) scale(${transform.scale})`}>
              {/* Render all shapes */}
              {shapes.map(shape => renderShape(shape, shape.id === selectedShapeId))}
              
              {/* Render current drawing shape */}
              {currentShape && renderShape(currentShape)}
              
              {/* Selection box */}
              {selectionBox && (
                <rect
                  x={Math.min(selectionBox.x, selectionBox.x + selectionBox.width)}
                  y={Math.min(selectionBox.y, selectionBox.y + selectionBox.height)}
                  width={Math.abs(selectionBox.width)}
                  height={Math.abs(selectionBox.height)}
                  stroke="#4A90E2"
                  strokeWidth={2 / transform.scale}
                  fill="rgba(74, 144, 226, 0.1)"
                  strokeDasharray={`${8 / transform.scale} ${4 / transform.scale}`}
                />
              )}
            </g>
          </svg>
        </div>

        {/* Help text */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur rounded-lg px-4 py-2 text-[14px] font-['Gaegu'] text-[#8c8fa6] pointer-events-none">
          Space+Drag to pan • Ctrl+Wheel to zoom • Shift for constraints • ESC to close
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface ToolButtonProps {
  icon: any;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
}

function ToolButton({ icon: Icon, active, onClick, disabled, tooltip }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`p-2 rounded-lg transition-all ${
        active
          ? 'bg-[#8774ff] text-white'
          : disabled
          ? 'text-[#b8bbd2] cursor-not-allowed'
          : 'text-[#474747] hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}
