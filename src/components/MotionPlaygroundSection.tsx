import { useEffect, useMemo, useState } from "react";
import {
  Alignment,
  Fit,
  Layout,
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceNumber,
  type Rive as RiveInstance,
} from "@rive-app/react-webgl2";
import { motion } from "motion/react";
import {
  Download,
  ExternalLink,
  Pause,
  Play,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

interface NumberControl {
  label: string;
  path: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

interface MotionProject {
  id: string;
  title: string;
  description: string;
  src: string;
  marketplaceUrl: string;
  tags: string[];
  accent: string;
  control?: NumberControl;
}

const motionProjects: MotionProject[] = [
  {
    id: "dynamic-streak-fire",
    title: "Dynamic streak fire",
    description: "A data-bound streak counter with a playful fire shape.",
    src: "https://public.rive.app/community/runtime-files/27337-51650-dynamic-streak-fire.riv",
    marketplaceUrl:
      "https://rive.app/marketplace/27337-51650-dynamic-streak-fire/",
    tags: ["Rive", "Data binding", "Interactive"],
    accent: "#ffb31a",
    control: {
      label: "streak",
      path: "streak",
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 24,
    },
  },
  {
    id: "loading-books",
    title: "Loading books",
    description: "A compact loader animation made for product moments.",
    src: "https://public.rive.app/community/runtime-files/27328-51630-loading-books.riv",
    marketplaceUrl:
      "https://rive.app/marketplace/27328-51630-loading-books/",
    tags: ["Rive", "Loader", "Motion"],
    accent: "#8774ff",
  },
];

const riveLayout = new Layout({
  fit: Fit.Contain,
  alignment: Alignment.Center,
});

function usePlayableRive(project: MotionProject) {
  const { rive, setCanvasRef } = useRive(
    {
      src: project.src,
      autoplay: true,
      autoBind: true,
      layout: riveLayout,
    },
    {
      useOffscreenRenderer: true,
      shouldResizeCanvasToContainer: false,
      shouldUseIntersectionObserver: false,
    }
  );

  useEffect(() => {
    if (!rive) return;

    const machineName = rive.stateMachineNames[0];
    const animationName = rive.animationNames[0];

    if (machineName) {
      rive.play(machineName);
    } else if (animationName) {
      rive.play(animationName);
    }

    rive.resizeDrawingSurfaceToCanvas();
  }, [project.id, rive]);

  return { rive, setCanvasRef };
}

function NumberBindingControl({
  control,
  rive,
}: {
  control: NumberControl;
  rive: RiveInstance | null;
}) {
  const [localValue, setLocalValue] = useState(control.defaultValue);
  const defaultViewModel = useViewModel(rive, { useDefault: true });
  const defaultInstance = useViewModelInstance(defaultViewModel, { rive });
  const boundNumber = useViewModelInstanceNumber(control.path, defaultInstance);

  const applyRiveNumber = (nextValue: number) => {
    boundNumber.setValue(nextValue);

    if (!rive) return;

    rive.stateMachineNames.forEach((stateMachineName) => {
      rive
        .stateMachineInputs(stateMachineName)
        .filter((input) => input.name.toLowerCase() === control.path.toLowerCase())
        .forEach((input) => {
          if (typeof input.value === "number") {
            input.value = nextValue;
          }
        });
    });

    try {
      const viewModel = rive.defaultViewModel();
      const instance = rive.viewModelInstance ?? viewModel?.defaultInstance();
      const numberProperty = instance?.number(control.path);

      if (numberProperty) {
        numberProperty.value = nextValue;
      }

      if (instance && rive.viewModelInstance !== instance) {
        rive.bindViewModelInstance(instance);
      }
    } catch {
      // Some files expose state-machine inputs instead of data-binding properties.
    }
  };

  useEffect(() => {
    setLocalValue(control.defaultValue);
    applyRiveNumber(control.defaultValue);
  }, [control.defaultValue, control.path, defaultInstance, rive]);

  const updateValue = (nextValue: number) => {
    setLocalValue(nextValue);
    applyRiveNumber(nextValue);
  };

  return (
    <div className="border-2 border-[#e5e7f0] bg-white p-4 rounded-lg">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="inline-flex items-center gap-2 text-[#474747]">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="font-['Gaegu'] text-[20px] leading-[24px]">
            {control.label}
          </span>
        </div>
        <span className="font-['Solway'] font-bold text-[20px] text-[#474747]">
          {Math.round(localValue)}
        </span>
      </div>

      <input
        type="range"
        min={control.min}
        max={control.max}
        step={control.step}
        value={localValue}
        onChange={(event) => updateValue(Number(event.target.value))}
        className="w-full"
        style={{ accentColor: "#8774ff" }}
        aria-label={control.label}
      />

      <div className="mt-4 flex items-center justify-between font-['Gaegu'] text-[16px] text-[#8c8fa6]">
        <span>{control.min}</span>
        <span>{control.max}</span>
      </div>
    </div>
  );
}

function RiveStage({
  project,
  onRiveChange,
}: {
  project: MotionProject;
  onRiveChange: (rive: RiveInstance | null) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const { rive, setCanvasRef } = usePlayableRive(project);

  useEffect(() => {
    setIsPlaying(true);
  }, [project.id]);

  useEffect(() => {
    onRiveChange(rive);
    return () => onRiveChange(null);
  }, [onRiveChange, rive]);

  const playbackNames = useMemo(() => {
    if (!rive) return undefined;

    const machineName = rive.stateMachineNames[0];
    const animationName = rive.animationNames[0];
    return machineName || animationName;
  }, [rive]);

  const togglePlayback = () => {
    if (!rive) return;

    if (isPlaying) {
      rive.pause(playbackNames);
    } else {
      rive.play(playbackNames);
    }

    setIsPlaying((current) => !current);
  };

  const replay = () => {
    if (!rive) return;

    rive.reset({ autoplay: true, autoBind: true });
    if (playbackNames) {
      rive.play(playbackNames);
    }
    setIsPlaying(true);
  };

  return (
    <div className="space-y-6">
      <div
        className="relative overflow-hidden rounded-lg border-2 border-[#474747] bg-[#1e1e1e]"
        style={{
          height: "min(70vw, 420px)",
          minHeight: 300,
          backgroundColor: "#1e1e1e",
          backgroundImage:
            "linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.05) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.05) 75%)",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0",
          backgroundSize: "20px 20px",
        }}
      >
        <canvas
          ref={setCanvasRef}
          width={900}
          height={600}
          className="h-full w-full"
          style={{ display: "block" }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={togglePlayback}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-[#474747] bg-white px-4 py-2 font-['Gaegu'] text-[20px] text-[#474747] transition-transform hover:scale-[1.02]"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          type="button"
          onClick={replay}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-[#474747] bg-white px-4 py-2 font-['Gaegu'] text-[20px] text-[#474747] transition-transform hover:scale-[1.02]"
        >
          <RotateCcw className="h-5 w-5" />
          Replay
        </button>

        <a
          href={project.src}
          download
          className="inline-flex items-center gap-2 rounded-lg border-2 border-[#474747] bg-white px-4 py-2 font-['Gaegu'] text-[20px] text-[#474747] transition-transform hover:scale-[1.02]"
        >
          <Download className="h-5 w-5" />
          Download
        </a>

        <a
          href={project.marketplaceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-[#474747] px-4 py-2 font-['Gaegu'] text-[20px] text-[#474747] transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: "#fff2b8" }}
        >
          <ExternalLink className="h-5 w-5" />
          Open in Rive
        </a>
      </div>
    </div>
  );
}

function MotionProjectButton({
  project,
  isSelected,
  onSelect,
}: {
  project: MotionProject;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border-2 p-4 text-left transition-transform hover:scale-[1.02] ${
        isSelected
          ? "border-[#474747] bg-white"
          : "border-[#e5e7f0] bg-[#f8f9fc]"
      }`}
      style={
        isSelected
          ? { boxShadow: "4px 4px 0 #474747" }
          : { boxShadow: "none" }
      }
    >
      <div className="flex items-center gap-3">
        <span
          className="h-4 w-4 shrink-0 rounded-full border-2 border-[#474747]"
          style={{ backgroundColor: project.accent }}
          aria-hidden="true"
        />
        <span className="font-['Solway'] font-bold text-[20px] leading-[24px] text-[#474747]">
          {project.title}
        </span>
      </div>
      <p className="mt-4 font-['Gaegu'] text-[18px] leading-[24px] text-[#8c8fa6]">
        {project.description}
      </p>
    </button>
  );
}

export function MotionPlaygroundSection() {
  const [selectedId, setSelectedId] = useState(motionProjects[0].id);
  const [activeRive, setActiveRive] = useState<RiveInstance | null>(null);
  const selectedProject =
    motionProjects.find((project) => project.id === selectedId) ??
    motionProjects[0];

  return (
    <section
      className="min-h-screen py-16 md:py-32 px-4 md:px-8"
      style={{ paddingBottom: "10rem" }}
    >
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-12 md:mb-24">
          <div className="h-[3px] w-[40px] md:w-[87px] bg-[#474747] rounded-full" />
          <h2 className="text-[32px] md:text-[42px] font-['Solway'] text-[#474747] whitespace-nowrap">
            Motion
          </h2>
          <div className="h-[3px] w-[40px] md:w-[87px] bg-[#474747] rounded-full" />
        </div>

        <motion.div
          key={selectedProject.id}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          <RiveStage project={selectedProject} onRiveChange={setActiveRive} />

          <div className="space-y-6">
            <div className="rounded-lg border-2 border-[#474747] bg-white p-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {selectedProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border-2 border-[#e5e7f0] bg-[#f8f9fc] px-4 py-2 font-['Gaegu'] text-[16px] text-[#474747]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="font-['Solway'] font-bold text-[32px] leading-[38.4px] text-[#474747]">
                {selectedProject.title}
              </h3>
              <p className="mt-4 font-['Gaegu'] text-[20px] leading-[24px] text-[#474747]">
                {selectedProject.description}
              </p>
            </div>

            {selectedProject.control && (
              <NumberBindingControl
                key={selectedProject.control.path}
                control={selectedProject.control}
                rive={activeRive}
              />
            )}

            <div className="space-y-4">
              {motionProjects.map((project) => (
                <MotionProjectButton
                  key={project.id}
                  project={project}
                  isSelected={project.id === selectedProject.id}
                  onSelect={() => setSelectedId(project.id)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
