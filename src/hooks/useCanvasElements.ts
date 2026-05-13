import { useState, useCallback } from 'react';
import { CanvasElement } from '../types/canvas';

function newZIndex(elements: CanvasElement[]): number {
  return elements.length > 0 ? Math.max(...elements.map(e => e.zIndex)) + 1 : 0;
}

export function useCanvasElements(initial: CanvasElement[] = []) {
  const [elements, setElements] = useState<CanvasElement[]>(initial);
  const [history, setHistory] = useState<CanvasElement[][]>([initial]);
  const [historyStep, setHistoryStep] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const pushHistory = useCallback((next: CanvasElement[]) => {
    setHistory(prev => {
      const trunk = prev.slice(0, historyStep + 1);
      return [...trunk, [...next]];
    });
    setHistoryStep(prev => prev + 1);
    setElements(next);
  }, [historyStep]);

  const addElement = useCallback(<T extends CanvasElement>(el: Omit<T, 'zIndex'>): T => {
    const full = { ...el, zIndex: newZIndex(elements) } as T;
    pushHistory([...elements, full]);
    return full;
  }, [elements, pushHistory]);

  const updateElement = useCallback((id: string, patch: Partial<CanvasElement>, toHistory = true) => {
    const next = elements.map(e => e.id === id ? { ...e, ...patch } as CanvasElement : e);
    if (toHistory) {
      pushHistory(next);
    } else {
      setElements(next);
    }
  }, [elements, pushHistory]);

  const updateElementLive = useCallback((id: string, patch: Partial<CanvasElement>) => {
    setElements(prev => prev.map(e => e.id === id ? { ...e, ...patch } as CanvasElement : e));
  }, []);

  const removeElement = useCallback((id: string) => {
    const next = elements.filter(e => e.id !== id);
    pushHistory(next);
    setSelectedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
  }, [elements, pushHistory]);

  const removeSelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    const next = elements.filter(e => !selectedIds.has(e.id));
    pushHistory(next);
    setSelectedIds(new Set());
  }, [elements, selectedIds, pushHistory]);

  const undo = useCallback(() => {
    if (historyStep > 0) {
      const step = historyStep - 1;
      setHistoryStep(step);
      setElements([...history[step]]);
      setSelectedIds(new Set());
    }
  }, [history, historyStep]);

  const redo = useCallback(() => {
    if (historyStep < history.length - 1) {
      const step = historyStep + 1;
      setHistoryStep(step);
      setElements([...history[step]]);
      setSelectedIds(new Set());
    }
  }, [history, historyStep]);

  const commitLiveChanges = useCallback(() => {
    // Call after a series of live (no-history) updates to push current state into history
    pushHistory([...elements]);
  }, [elements, pushHistory]);

  const clearAll = useCallback(() => {
    pushHistory([]);
    setSelectedIds(new Set());
  }, [pushHistory]);

  const bringToFront = useCallback((id: string) => {
    const maxZ = newZIndex(elements);
    updateElement(id, { zIndex: maxZ }, false);
  }, [elements, updateElement]);

  return {
    elements,
    setElements,
    selectedIds,
    setSelectedIds,
    addElement,
    updateElement,
    updateElementLive,
    commitLiveChanges,
    removeElement,
    removeSelected,
    undo,
    redo,
    canUndo: historyStep > 0,
    canRedo: historyStep < history.length - 1,
    clearAll,
    bringToFront,
    pushHistory,
  };
}
