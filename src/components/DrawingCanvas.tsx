import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2 } from "lucide-react";

const ExcalidrawCanvas = lazy(() => import("./DrawingCanvasExcalidraw"));

interface DrawingCanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

function LoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#8774ff]" />
        <div>
          <p className="font-['Gaegu'] text-[20px] leading-[24px] text-[#231f20]">
            Loading canvas...
          </p>
          <p className="mt-1 font-['Figtree'] text-sm text-[#8c8fa6]">
            Excalidraw is being prepared for your portfolio.
          </p>
        </div>
      </div>
    </div>
  );
}

export function DrawingCanvas({ isOpen, onClose }: DrawingCanvasProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="drawing-canvas-overlay"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#231f20]/24 px-4 py-4 backdrop-blur-[3px] md:px-6 md:py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative h-full w-full max-w-[1440px] overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0px_24px_80px_rgba(35,31,32,0.18)]"
            initial={{ opacity: 0, scale: 0.97, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <Suspense fallback={<LoadingFallback />}>
              <ExcalidrawCanvas onClose={onClose} />
            </Suspense>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
