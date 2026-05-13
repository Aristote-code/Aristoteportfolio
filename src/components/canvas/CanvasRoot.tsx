import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getStroke } from 'perfect-freehand';

import {
  ToolType, CanvasElement, DrawingElement, Point,
  StickyNoteElement, TextBoxElement, VideoElement, ImageElement,
  EmojiElement, FrameElement,
} from '../../types/canvas';
import { useCanvasTransform } from '../../hooks/useCanvasTransform';
import { useCanvasElements } from '../../hooks/useCanvasElements';
import { SvgLayer } from './SvgLayer';
import { HtmlLayer } from './HtmlLayer';
import { CanvasToolbar } from './toolbar/CanvasToolbar';
import { ZoomControls } from './ZoomControls';
import { Minimap } from './Minimap';
import { ParsedVideo } from '../../utils/canvas/videoParser';

interface CanvasRootProps {
  isOpen: boolean;
  onClose: () => void;
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

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

export function CanvasRoot({ isOpen, onClose }: CanvasRootProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    transform, setTransform,
    getPointerPos, screenToWorld, worldToScreen,
    handleWheel, zoomIn, zoomOut, zoomReset, zoomFit, panBy,
  } = useCanvasTransform(canvasRef);

  const {
    elements, selectedIds, setSelectedIds,
    addElement, updateElement, updateElementLive, commitLiveChanges,
    removeElement, removeSelected,
    undo, redo, canUndo, canRedo,
  } = useCanvasElements();

  // Drawing state
  const [tool, setTool] = useState<ToolType>('select');
  const [strokeColor, setStrokeColor] = useState('#474747');
  const [fillColor, setFillColor] = useState('transparent');
  const [currentDrawing, setCurrentDrawing] = useState<DrawingElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  // Emoji stamp pending
  const [pendingEmoji, setPendingEmoji] = useState<string | null>(null);

  // Connector drawing state
  const [connectorFrom, setConnectorFrom] = useState<{ id: string; anchor: 'top' | 'right' | 'bottom' | 'left' } | null>(null);

  // Element drag state
  const elementDragRef = useRef<{ id: string; startX: number; startY: number; elX: number; elY: number } | null>(null);

  // ─── Wheel zoom ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => handleWheel(e);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [handleWheel]);

  // ─── Keyboard shortcuts ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
        return;
      }
      if (e.key === 'Escape') { setSelectedIds(new Set()); onClose(); return; }

      if (isEditing) return;

      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); removeSelected(); return; }
      if (e.key === ' ' && !isSpacePressed) { e.preventDefault(); setIsSpacePressed(true); return; }

      if (e.key === 'v') setTool('select');
      if (e.key === 'p') setTool('pen');
      if (e.key === 'r') setTool('rectangle');
      if (e.key === 'o') setTool('ellipse');
      if (e.key === 'l') setTool('line');
      if (e.key === 'a') setTool('arrow');
      if (e.key === 's') setTool('sticky');
      if (e.key === 't') setTool('text');
      if (e.key === 'f') setTool('frame');
      if (e.key === 'c') setTool('connector');
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') { setIsSpacePressed(false); setIsPanning(false); }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); };
  }, [isOpen, undo, redo, removeSelected, onClose, isSpacePressed, setSelectedIds]);

  // ─── Hit-test HTML elements ──────────────────────────────────────────────────
  const hitTestHtml = useCallback((worldX: number, worldY: number): CanvasElement | null => {
    const htmlTypes = ['sticky', 'text', 'video', 'image', 'emoji'];
    const candidates = elements.filter(e => htmlTypes.includes(e.elementType));
    for (let i = candidates.length - 1; i >= 0; i--) {
      const el = candidates[i];
      if (worldX >= el.x && worldX <= el.x + el.width && worldY >= el.y && worldY <= el.y + el.height) {
        return el;
      }
    }
    return null;
  }, [elements]);

  // ─── Hit-test SVG shapes ─────────────────────────────────────────────────────
  const hitTestSvg = useCallback((worldX: number, worldY: number): CanvasElement | null => {
    const tol = 8;
    const svgTypes = ['drawing', 'frame', 'connector'];
    const candidates = elements.filter(e => svgTypes.includes(e.elementType));
    for (let i = candidates.length - 1; i >= 0; i--) {
      const el = candidates[i];
      if (worldX >= el.x - tol && worldX <= el.x + el.width + tol &&
          worldY >= el.y - tol && worldY <= el.y + el.height + tol) {
        return el;
      }
    }
    return null;
  }, [elements]);

  // ─── Pointer events ───────────────────────────────────────────────────────────
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const screenPos = getPointerPos(e);
    const worldPos = screenToWorld(screenPos.x, screenPos.y);

    // Pan with space
    if (isSpacePressed) {
      setIsPanning(true);
      setDragStart(screenPos);
      return;
    }

    // Emoji stamp
    if (pendingEmoji) {
      addElement<EmojiElement>({
        id: uid(), elementType: 'emoji', emoji: pendingEmoji, size: 36,
        x: worldPos.x - 20, y: worldPos.y - 20, width: 40, height: 40, zIndex: 0,
      });
      // Keep emoji tool active for multiple stamps; right-click or ESC to stop
      return;
    }

    if (tool === 'select') {
      const hit = hitTestHtml(worldPos.x, worldPos.y) ?? hitTestSvg(worldPos.x, worldPos.y);
      if (hit) {
        setSelectedIds(new Set([hit.id]));
        setDragStart(worldPos);
      } else {
        setSelectedIds(new Set());
        setDragStart(worldPos);
        setSelectionBox({ x: worldPos.x, y: worldPos.y, width: 0, height: 0 });
      }
      return;
    }

    if (tool === 'sticky') {
      const id = uid();
      addElement<StickyNoteElement>({
        id, elementType: 'sticky', text: '', color: 'yellow', fontSize: 16,
        x: worldPos.x - 80, y: worldPos.y - 80, width: 160, height: 160, zIndex: 0,
      });
      setTool('select');
      return;
    }

    if (tool === 'text') {
      const id = uid();
      addElement<TextBoxElement>({
        id, elementType: 'text', content: '', fontSize: 16, fontWeight: 'normal',
        color: '#1a1a2e', align: 'left',
        x: worldPos.x, y: worldPos.y, width: 200, height: 40, zIndex: 0,
      });
      setTool('select');
      return;
    }

    if (tool === 'frame') {
      setIsDrawing(true);
      setDragStart(worldPos);
      return;
    }

    // Drawing tools
    const drawingTypes: ToolType[] = ['pen', 'rectangle', 'ellipse', 'line', 'arrow', 'triangle', 'star', 'hexagon'];
    if (drawingTypes.includes(tool)) {
      setIsDrawing(true);
      setDragStart(worldPos);
      const base: Omit<DrawingElement, 'drawingType'> = {
        id: uid(), elementType: 'drawing',
        x: worldPos.x, y: worldPos.y, width: 0, height: 0, zIndex: 0,
        strokeColor, strokeWidth: 2, fillColor,
      };
      if (tool === 'pen') {
        setCurrentDrawing({ ...base, drawingType: 'pen', points: [worldPos], x2: worldPos.x, y2: worldPos.y });
      } else if (tool === 'rectangle') {
        setCurrentDrawing({ ...base, drawingType: 'rectangle' });
      } else if (tool === 'ellipse') {
        setCurrentDrawing({ ...base, drawingType: 'ellipse', rx: 0, ry: 0 });
      } else if (tool === 'line') {
        setCurrentDrawing({ ...base, drawingType: 'line', x2: worldPos.x, y2: worldPos.y, width: 0, height: 0 });
      } else if (tool === 'arrow') {
        setCurrentDrawing({ ...base, drawingType: 'arrow', x2: worldPos.x, y2: worldPos.y, width: 0, height: 0 });
      } else if (tool === 'triangle') {
        setCurrentDrawing({ ...base, drawingType: 'triangle' });
      } else if (tool === 'star') {
        setCurrentDrawing({ ...base, drawingType: 'star', size: 0 });
      } else if (tool === 'hexagon') {
        setCurrentDrawing({ ...base, drawingType: 'hexagon', size: 0 });
      }
    }
  }, [
    isSpacePressed, pendingEmoji, tool, addElement, hitTestHtml, hitTestSvg,
    getPointerPos, screenToWorld, strokeColor, fillColor, setSelectedIds,
  ]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const screenPos = getPointerPos(e);
    const worldPos = screenToWorld(screenPos.x, screenPos.y);

    if (isPanning && dragStart) {
      panBy(screenPos.x - dragStart.x, screenPos.y - dragStart.y);
      setDragStart(screenPos);
      return;
    }

    // Selection box
    if (tool === 'select' && selectionBox && dragStart && selectedIds.size === 0) {
      setSelectionBox({ x: dragStart.x, y: dragStart.y, width: worldPos.x - dragStart.x, height: worldPos.y - dragStart.y });
      return;
    }

    // Move selected SVG shape
    if (tool === 'select' && selectedIds.size === 1 && dragStart && !isDrawing) {
      const [id] = selectedIds;
      const el = elements.find(e => e.id === id);
      if (el && (el.elementType === 'drawing' || el.elementType === 'frame' || el.elementType === 'connector')) {
        const dx = worldPos.x - dragStart.x;
        const dy = worldPos.y - dragStart.y;
        if (el.elementType === 'drawing' && (el.drawingType === 'line' || el.drawingType === 'arrow')) {
          updateElementLive(id, {
            x: el.x + dx, y: el.y + dy,
            x2: (el.x2 ?? el.x) + dx,
            y2: (el.y2 ?? el.y) + dy,
          });
        } else {
          updateElementLive(id, { x: el.x + dx, y: el.y + dy });
        }
        setDragStart(worldPos);
      }
      return;
    }

    // Frame drawing
    if (tool === 'frame' && isDrawing && dragStart) {
      const w = worldPos.x - dragStart.x;
      const h = worldPos.y - dragStart.y;
      setSelectionBox({ x: Math.min(worldPos.x, dragStart.x), y: Math.min(worldPos.y, dragStart.y), width: Math.abs(w), height: Math.abs(h) });
      return;
    }

    if (!isDrawing || !currentDrawing || !dragStart) return;

    if (currentDrawing.drawingType === 'pen') {
      setCurrentDrawing(prev => prev ? { ...prev, points: [...(prev.points ?? []), worldPos] } : null);
    } else if (currentDrawing.drawingType === 'rectangle' || currentDrawing.drawingType === 'triangle') {
      const w = worldPos.x - dragStart.x;
      const h = worldPos.y - dragStart.y;
      setCurrentDrawing(prev => prev ? {
        ...prev,
        x: w < 0 ? worldPos.x : dragStart.x,
        y: h < 0 ? worldPos.y : dragStart.y,
        width: Math.abs(w), height: Math.abs(h),
      } : null);
    } else if (currentDrawing.drawingType === 'ellipse') {
      const rx = Math.abs(worldPos.x - dragStart.x) / 2;
      const ry = Math.abs(worldPos.y - dragStart.y) / 2;
      setCurrentDrawing(prev => prev ? {
        ...prev,
        x: (worldPos.x + dragStart.x) / 2,
        y: (worldPos.y + dragStart.y) / 2,
        rx, ry, width: rx * 2, height: ry * 2,
      } : null);
    } else if (currentDrawing.drawingType === 'line' || currentDrawing.drawingType === 'arrow') {
      setCurrentDrawing(prev => prev ? { ...prev, x2: worldPos.x, y2: worldPos.y } : null);
    } else if (currentDrawing.drawingType === 'star' || currentDrawing.drawingType === 'hexagon') {
      const sz = Math.hypot(worldPos.x - dragStart.x, worldPos.y - dragStart.y);
      setCurrentDrawing(prev => prev ? { ...prev, size: sz, width: sz * 2, height: sz * 2 } : null);
    }
  }, [
    isPanning, dragStart, tool, selectionBox, selectedIds, isDrawing, currentDrawing,
    elements, getPointerPos, screenToWorld, panBy, updateElementLive,
  ]);

  const handlePointerUp = useCallback(() => {
    if (isPanning) { setIsPanning(false); setDragStart(null); return; }

    // Finalize selection box
    if (tool === 'select' && selectionBox) {
      const inBox = elements.filter(el => {
        const minX = Math.min(selectionBox.x, selectionBox.x + selectionBox.width);
        const maxX = Math.max(selectionBox.x, selectionBox.x + selectionBox.width);
        const minY = Math.min(selectionBox.y, selectionBox.y + selectionBox.height);
        const maxY = Math.max(selectionBox.y, selectionBox.y + selectionBox.height);
        return el.x >= minX && el.x + el.width <= maxX && el.y >= minY && el.y + el.height <= maxY;
      });
      if (inBox.length > 0) setSelectedIds(new Set(inBox.map(e => e.id)));
      setSelectionBox(null);
      setDragStart(null);
      return;
    }

    // Commit SVG shape move
    if (tool === 'select' && selectedIds.size === 1 && dragStart) {
      commitLiveChanges();
      setDragStart(null);
      return;
    }

    // Commit frame drawing
    if (tool === 'frame' && isDrawing && selectionBox) {
      if (selectionBox.width > 20 && selectionBox.height > 20) {
        addElement<FrameElement>({
          id: uid(), elementType: 'frame', label: 'Section',
          x: selectionBox.x, y: selectionBox.y,
          width: selectionBox.width, height: selectionBox.height,
          backgroundColor: 'rgba(239,246,255,0.7)',
          borderColor: '#93c5fd',
          childIds: [], zIndex: 0,
        });
      }
      setSelectionBox(null);
      setIsDrawing(false);
      setDragStart(null);
      setTool('select');
      return;
    }

    if (!isDrawing || !currentDrawing) { setDragStart(null); return; }

    let final = { ...currentDrawing };

    // Process pen with perfect-freehand
    if (final.drawingType === 'pen' && final.points && final.points.length > 1) {
      const stroke = getStroke(final.points, { size: 4, thinning: 0.5, smoothing: 0.5, streamline: 0.5 });
      final = { ...final, pathData: getSvgPath(stroke) };
    }

    // Min-size filter
    let skip = false;
    if (final.drawingType === 'rectangle' || final.drawingType === 'triangle') {
      if (final.width < 5 || final.height < 5) skip = true;
    } else if (final.drawingType === 'ellipse') {
      if ((final.rx ?? 0) < 3 || (final.ry ?? 0) < 3) skip = true;
    } else if (final.drawingType === 'star' || final.drawingType === 'hexagon') {
      if ((final.size ?? 0) < 10) skip = true;
    }

    if (!skip) addElement<DrawingElement>(final);
    setCurrentDrawing(null);
    setIsDrawing(false);
    setDragStart(null);
  }, [
    isPanning, tool, selectionBox, selectedIds, dragStart, isDrawing, currentDrawing,
    elements, addElement, commitLiveChanges, setSelectedIds,
  ]);

  // ─── HTML element drag ───────────────────────────────────────────────────────
  const handleElementDragStart = useCallback((id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    const el = elements.find(ev => ev.id === id);
    if (!el) return;
    const screenPos = getPointerPos(e);
    const worldPos = screenToWorld(screenPos.x, screenPos.y);
    elementDragRef.current = { id, startX: worldPos.x, startY: worldPos.y, elX: el.x, elY: el.y };

    const onMove = (ev: PointerEvent) => {
      if (!elementDragRef.current) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = ev.clientX - rect.left;
      const sy = ev.clientY - rect.top;
      const wx = (sx - transform.tx) / transform.scale;
      const wy = (sy - transform.ty) / transform.scale;
      const dx = wx - elementDragRef.current.startX;
      const dy = wy - elementDragRef.current.startY;
      updateElementLive(id, {
        x: elementDragRef.current.elX + dx,
        y: elementDragRef.current.elY + dy,
      });
    };

    const onUp = () => {
      if (elementDragRef.current) { commitLiveChanges(); elementDragRef.current = null; }
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [elements, getPointerPos, screenToWorld, transform, updateElementLive, commitLiveChanges]);

  // ─── Insert video ────────────────────────────────────────────────────────────
  const handleInsertVideo = useCallback((parsed: ParsedVideo, w: number, h: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const cx = rect ? rect.width / 2 : 400;
    const cy = rect ? rect.height / 2 : 300;
    const world = screenToWorld(cx, cy);
    addElement<VideoElement>({
      id: uid(), elementType: 'video',
      videoType: parsed.videoType,
      embedUrl: parsed.embedUrl,
      label: '',
      x: world.x - w / 2, y: world.y - h / 2,
      width: w, height: h, zIndex: 0,
    });
  }, [addElement, screenToWorld]);

  // ─── Insert image ────────────────────────────────────────────────────────────
  const handleInsertImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const src = ev.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const rect = canvasRef.current?.getBoundingClientRect();
          const cx = rect ? rect.width / 2 : 400;
          const cy = rect ? rect.height / 2 : 300;
          const world = screenToWorld(cx, cy);
          const w = Math.min(400, img.naturalWidth);
          const h = (img.naturalHeight / img.naturalWidth) * w;
          addElement<ImageElement>({
            id: uid(), elementType: 'image', src,
            naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight,
            x: world.x - w / 2, y: world.y - h / 2, width: w, height: h, zIndex: 0,
          });
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [addElement, screenToWorld]);

  // ─── Emoji tool ───────────────────────────────────────────────────────────────
  const handleSelectEmoji = useCallback((emoji: string) => {
    setPendingEmoji(emoji);
    setTool('emoji');
  }, []);

  // ─── Viewport size ────────────────────────────────────────────────────────────
  const [vpSize, setVpSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const e = entries[0];
      if (e) setVpSize({ width: e.contentRect.width, height: e.contentRect.height });
    });
    if (canvasRef.current) obs.observe(canvasRef.current);
    return () => obs.disconnect();
  }, []);

  const cursor = isPanning || isSpacePressed ? 'grab'
    : tool === 'select' ? 'default'
    : tool === 'emoji' ? 'copy'
    : 'crosshair';

  if (!isOpen) return null;

  const svgDrawings = elements.filter(e => e.elementType === 'drawing') as DrawingElement[];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'white', display: 'flex', flexDirection: 'column',
        }}
        className="hidden md:flex"
      >
        {/* Canvas area */}
        <div
          ref={canvasRef}
          style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor, touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* SVG Layer */}
          <SvgLayer
            elements={elements}
            currentDrawing={currentDrawing}
            selectionBox={selectionBox}
            selectedIds={selectedIds}
            transform={transform}
          />

          {/* HTML Layer */}
          <HtmlLayer
            elements={elements}
            selectedIds={selectedIds}
            transform={transform}
            onSelect={id => setSelectedIds(new Set([id]))}
            onUpdateElement={(id, patch) => updateElementLive(id, patch as Partial<CanvasElement>)}
            onCommitElement={() => commitLiveChanges()}
            onElementDragStart={handleElementDragStart}
            onImageResize={(id, patch) => updateElementLive(id, patch as Partial<CanvasElement>)}
          />

          {/* Zoom controls */}
          <ZoomControls
            scale={transform.scale}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onZoomReset={zoomReset}
            onZoomFit={() => zoomFit(elements)}
          />

          {/* Minimap */}
          <Minimap
            elements={elements}
            transform={transform}
            viewportSize={vpSize}
            onNavigate={(tx, ty) => setTransform(prev => ({ ...prev, tx, ty }))}
          />

          {/* Help text */}
          <div style={{
            position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
            borderRadius: 10, padding: '8px 18px',
            fontSize: 13, fontFamily: "'Gaegu', cursive", color: '#8c8fa6',
            pointerEvents: 'none', whiteSpace: 'nowrap',
            border: '1px solid #e5e7f0',
          }}>
            {pendingEmoji
              ? `Stamp mode: ${pendingEmoji} — click to place, press Esc to stop`
              : 'Space+Drag to pan · Ctrl/⌘+Scroll to zoom · Shift constraints · Esc to close'}
          </div>
        </div>

        {/* Toolbar */}
        <CanvasToolbar
          tool={tool}
          setTool={t => { setTool(t); if (t !== 'emoji') setPendingEmoji(null); }}
          strokeColor={strokeColor}
          setStrokeColor={setStrokeColor}
          fillColor={fillColor}
          setFillColor={setFillColor}
          canUndo={canUndo}
          canRedo={canRedo}
          hasSelection={selectedIds.size > 0}
          onUndo={undo}
          onRedo={redo}
          onDelete={removeSelected}
          onClose={onClose}
          onInsertVideo={handleInsertVideo}
          onInsertImage={handleInsertImage}
          onSelectEmoji={handleSelectEmoji}
        />
      </motion.div>
    </AnimatePresence>
  );
}
