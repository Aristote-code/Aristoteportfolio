import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Excalidraw,
  MainMenu,
  THEME,
  restore,
  serializeAsJSON,
} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import "./DrawingCanvasExcalidraw.css";
import type {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types";
import { X } from "lucide-react";

const SCENE_STORAGE_KEY = "portfolio.excalidraw.scene";
const LIBRARY_STORAGE_KEY = "portfolio.excalidraw.library";
const DEFAULT_CANVAS_BACKGROUND = "transparent";

const EXCALIDRAW_UI_OPTIONS = {
  canvasActions: {
    changeViewBackgroundColor: false,
    clearCanvas: true,
    export: {
      saveFileToDisk: true,
    },
    loadScene: true,
    saveAsImage: true,
    saveToActiveFile: true,
  },
  tools: {
    image: true,
  },
} as const;

interface DrawingCanvasExcalidrawProps {
  onClose: () => void;
}

function readStorageValue(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to read Excalidraw storage key "${key}"`, error);
    return null;
  }
}

function removeStorageValue(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove Excalidraw storage key "${key}"`, error);
  }
}

function getCanvasAppState(
  appState?: ExcalidrawInitialDataState["appState"] | Parameters<typeof serializeAsJSON>[1] | null,
) {
  return {
    ...(appState ?? {}),
    openSidebar: null,
    theme: THEME.LIGHT,
    viewBackgroundColor: DEFAULT_CANVAS_BACKGROUND,
  };
}

function getInitialSceneData(): ExcalidrawInitialDataState | null {
  const rawScene = readStorageValue(SCENE_STORAGE_KEY);

  if (!rawScene) {
    return {
      appState: getCanvasAppState(),
    };
  }

  try {
    const parsedScene = JSON.parse(rawScene) as Parameters<typeof restore>[0];
    const restoredScene = restore(parsedScene, null, null);

    return {
      ...restoredScene,
      appState: getCanvasAppState(restoredScene.appState),
      scrollToContent: false,
    };
  } catch (error) {
    console.error("Failed to restore Excalidraw scene from localStorage", error);
    removeStorageValue(SCENE_STORAGE_KEY);

    return {
      appState: getCanvasAppState(),
    };
  }
}

export default function DrawingCanvasExcalidraw({
  onClose,
}: DrawingCanvasExcalidrawProps) {
  const [excalidrawApi, setExcalidrawApi] =
    useState<ExcalidrawImperativeAPI | null>(null);
  const persistTimeoutRef = useRef<number | null>(null);
  const initialData = useMemo(() => getInitialSceneData(), []);

  useEffect(() => {
    return () => {
      if (persistTimeoutRef.current !== null) {
        window.clearTimeout(persistTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    removeStorageValue(LIBRARY_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (!excalidrawApi) {
      return;
    }

    const appState = excalidrawApi.getAppState();

    if (
      appState.theme !== THEME.LIGHT ||
      appState.viewBackgroundColor !== DEFAULT_CANVAS_BACKGROUND
    ) {
      excalidrawApi.updateScene({
        appState: getCanvasAppState(appState),
      });
    }
  }, [excalidrawApi]);

  const persistScene = useCallback(
    (elements: Parameters<typeof serializeAsJSON>[0], appState: Parameters<typeof serializeAsJSON>[1], files: Parameters<typeof serializeAsJSON>[2]) => {
      const normalizedAppState = getCanvasAppState(appState);

      if (
        appState.theme !== THEME.LIGHT ||
        appState.viewBackgroundColor !== DEFAULT_CANVAS_BACKGROUND
      ) {
        excalidrawApi?.updateScene({
          appState: normalizedAppState,
        });
      }

      if (persistTimeoutRef.current !== null) {
        window.clearTimeout(persistTimeoutRef.current);
      }

      persistTimeoutRef.current = window.setTimeout(() => {
        try {
          const serializedScene = serializeAsJSON(
            elements,
            normalizedAppState,
            files,
            "local",
          );
          window.localStorage.setItem(SCENE_STORAGE_KEY, serializedScene);
        } catch (error) {
          console.error("Failed to persist Excalidraw scene locally", error);
          excalidrawApi?.setToast({
            message: "Couldn't save the canvas locally.",
            duration: 3000,
          });
        }
      }, 150);
    },
    [excalidrawApi],
  );

  const renderTopRightUI = useCallback(() => {
    return (
      <button
        type="button"
        onClick={onClose}
        className="mr-3 mt-3 inline-flex items-center gap-2 rounded-full border border-[#e5e7f0] bg-white/96 px-4 py-2 font-['Figtree'] text-sm font-semibold text-[#231f20] shadow-[0px_10px_30px_rgba(35,31,32,0.08)] transition hover:border-[#d8d9e7] hover:bg-white"
        aria-label="Close drawing canvas"
      >
        <X className="h-4 w-4" />
        <span>Close</span>
      </button>
    );
  }, [onClose]);

  return (
    <div className="drawing-canvas-excalidraw h-full w-full">
      <Excalidraw
        autoFocus
        excalidrawAPI={setExcalidrawApi}
        initialData={initialData}
        name="Aristote Portfolio Canvas"
        onChange={persistScene}
        renderTopRightUI={renderTopRightUI}
        theme={THEME.LIGHT}
        UIOptions={EXCALIDRAW_UI_OPTIONS}
      >
        <MainMenu>
          <MainMenu.Group title="Board">
            <MainMenu.DefaultItems.LoadScene />
            <MainMenu.DefaultItems.Export />
            <MainMenu.DefaultItems.ClearCanvas />
          </MainMenu.Group>
        </MainMenu>
      </Excalidraw>
    </div>
  );
}
