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
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative h-full w-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
