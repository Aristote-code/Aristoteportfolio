import { useState, useCallback, RefObject } from 'react';
import { Transform, Point } from '../types/canvas';

export function useCanvasTransform(canvasRef: RefObject<HTMLDivElement | null>) {
  const [transform, setTransform] = useState<Transform>({ scale: 1, tx: 0, ty: 0 });

  const getPointerPos = useCallback((e: React.PointerEvent | WheelEvent | MouseEvent): Point => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, [canvasRef]);

  const screenToWorld = useCallback((sx: number, sy: number): Point => ({
    x: (sx - transform.tx) / transform.scale,
    y: (sy - transform.ty) / transform.scale,
  }), [transform]);

  const worldToScreen = useCallback((wx: number, wy: number): Point => ({
    x: wx * transform.scale + transform.tx,
    y: wy * transform.scale + transform.ty,
  }), [transform]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

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
  }, [canvasRef]);

  const zoomIn = useCallback(() => {
    setTransform(prev => {
      const rect = canvasRef.current?.getBoundingClientRect();
      const cx = rect ? rect.width / 2 : 0;
      const cy = rect ? rect.height / 2 : 0;
      const newScale = Math.min(5, prev.scale * 1.2);
      const scaleChange = newScale / prev.scale;
      return {
        scale: newScale,
        tx: cx - (cx - prev.tx) * scaleChange,
        ty: cy - (cy - prev.ty) * scaleChange,
      };
    });
  }, [canvasRef]);

  const zoomOut = useCallback(() => {
    setTransform(prev => {
      const rect = canvasRef.current?.getBoundingClientRect();
      const cx = rect ? rect.width / 2 : 0;
      const cy = rect ? rect.height / 2 : 0;
      const newScale = Math.max(0.1, prev.scale / 1.2);
      const scaleChange = newScale / prev.scale;
      return {
        scale: newScale,
        tx: cx - (cx - prev.tx) * scaleChange,
        ty: cy - (cy - prev.ty) * scaleChange,
      };
    });
  }, [canvasRef]);

  const zoomReset = useCallback(() => {
    setTransform({ scale: 1, tx: 0, ty: 0 });
  }, []);

  const zoomFit = useCallback((
    elements: Array<{ x: number; y: number; width: number; height: number }>
  ) => {
    if (elements.length === 0) {
      zoomReset();
      return;
    }
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const minX = Math.min(...elements.map(e => e.x));
    const minY = Math.min(...elements.map(e => e.y));
    const maxX = Math.max(...elements.map(e => e.x + e.width));
    const maxY = Math.max(...elements.map(e => e.y + e.height));

    const bboxW = maxX - minX || 400;
    const bboxH = maxY - minY || 300;
    const padding = 80;
    const scale = Math.min(
      (rect.width - padding * 2) / bboxW,
      (rect.height - padding * 2) / bboxH,
      2
    );

    const tx = rect.width / 2 - (minX + bboxW / 2) * scale;
    const ty = rect.height / 2 - (minY + bboxH / 2) * scale;
    setTransform({ scale, tx, ty });
  }, [canvasRef, zoomReset]);

  const panBy = useCallback((dx: number, dy: number) => {
    setTransform(prev => ({ ...prev, tx: prev.tx + dx, ty: prev.ty + dy }));
  }, []);

  return {
    transform,
    setTransform,
    getPointerPos,
    screenToWorld,
    worldToScreen,
    handleWheel,
    zoomIn,
    zoomOut,
    zoomReset,
    zoomFit,
    panBy,
  };
}
