import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  Alignment,
  Fit,
  Layout,
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceNumber,
  useViewModelInstanceString,
  type Rive as RiveInstance,
} from "@rive-app/react-webgl2";
import { motion } from "motion/react";
import {
  Download,
  ExternalLink,
  Minus,
  Pause,
  Plus,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Type,
} from "lucide-react";

interface NumberControl {
  label: string;
  path: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  viewModelName?: string;
}

interface TextControl {
  label: string;
  path: string;
  defaultValue: string;
  multiline?: boolean;
  viewModelName?: string;
}

interface StageSettings {
  height?: string;
  minHeight?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  canvasMode?: "fill" | "contain";
}

interface MotionProject {
  id: string;
  title: string;
  description: string;
  src: string;
  marketplaceUrl?: string;
  tags: string[];
  accent: string;
  bgColor: string;
  fit: Fit;
  numberControls?: NumberControl[];
  textControls?: TextControl[];
  stage?: StageSettings;
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
    bgColor: "#1e1300",
    fit: Fit.Contain,
    numberControls: [
      {
        label: "streak",
        path: "streak",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 24,
      },
    ],
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
    bgColor: "#0d0820",
    fit: Fit.Contain,
  },
  {
    id: "study-screen-animation",
    title: "Learning Path System animation",
    description:
      "An interactive learning-path concept with dynamic theming and editable lesson copy.",
    src: "https://public.rive.app/community/runtime-files/27817-52722-learning-path-system-animation.riv",
    marketplaceUrl:
      "https://rive.app/community/files/27817-52722-learning-path-system-animation/",
    tags: ["Rive", "Learning", "Interactive"],
    accent: "#8d3ee8",
    bgColor: "#171717",
    fit: Fit.Contain,
    stage: {
      height: "clamp(620px, 70vw, 780px)",
      minHeight: 620,
      canvasWidth: 390,
      canvasHeight: 900,
      canvasMode: "contain",
    },
    numberControls: [
      {
        label: "theme",
        path: "theme",
        min: 1,
        max: 4,
        step: 1,
        defaultValue: 1,
      },
    ],
    textControls: [
      {
        label: "title",
        path: "title",
        defaultValue: "Lesson Title",
        viewModelName: "StudyCardVM",
      },
      {
        label: "durationLabel",
        path: "durationLabel",
        defaultValue: "00 MIN",
        viewModelName: "StudyCardVM",
      },
      {
        label: "buttonLabel",
        path: "buttonLabel",
        defaultValue: "BUTTON LABEL",
        viewModelName: "StudyCardVM",
      },
    ],
  },
];

function usePlayableRive(project: MotionProject) {
  const layout = useMemo(
    () => new Layout({ fit: project.fit, alignment: Alignment.Center }),
    [project.fit]
  );

  const { rive, setCanvasRef } = useRive(
    {
      src: project.src,
      autoplay: true,
      autoBind: true,
      layout,
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

function useBoundViewModelInstance(
  rive: RiveInstance | null,
  viewModelName?: string
) {
  const viewModel = useViewModel(
    rive,
    viewModelName ? { name: viewModelName } : { useDefault: true }
  );

  return useViewModelInstance(viewModel, { rive });
}

function NumberBindingControl({
  control,
  accent,
  rive,
}: {
  control: NumberControl;
  accent: string;
  rive: RiveInstance | null;
}) {
  const [localValue, setLocalValue] = useState(control.defaultValue);
  const defaultInstance = useBoundViewModelInstance(rive, control.viewModelName);
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
      rive.setNumberStateAtPath(control.path, nextValue, "");
    } catch {
      // Root-level state machine inputs do not always need path-based updates.
    }

    try {
      const viewModel = control.viewModelName
        ? rive.viewModelByName(control.viewModelName)
        : rive.defaultViewModel();
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
    const boundedValue = Math.min(control.max, Math.max(control.min, nextValue));

    setLocalValue(boundedValue);
    applyRiveNumber(boundedValue);
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

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => updateValue(localValue - control.step)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-[#e5e7f0] bg-[#f8f9fc] text-[#474747]"
          aria-label={`Decrease ${control.label}`}
        >
          <Minus className="h-4 w-4" />
        </button>

        <input
          type="range"
          min={control.min}
          max={control.max}
          step={control.step}
          value={localValue}
          onChange={(event) => updateValue(Number(event.target.value))}
          className="min-w-0 flex-1"
          style={{ accentColor: accent }}
          aria-label={control.label}
        />

        <button
          type="button"
          onClick={() => updateValue(localValue + control.step)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-[#e5e7f0] bg-[#f8f9fc] text-[#474747]"
          aria-label={`Increase ${control.label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between font-['Gaegu'] text-[16px] text-[#8c8fa6]">
        <span>{control.min}</span>
        <span>{control.max}</span>
      </div>
    </div>
  );
}

function TextBindingControl({
  control,
  rive,
}: {
  control: TextControl;
  rive: RiveInstance | null;
}) {
  const [localValue, setLocalValue] = useState(control.defaultValue);
  const defaultInstance = useBoundViewModelInstance(rive, control.viewModelName);
  const boundString = useViewModelInstanceString(control.path, defaultInstance);

  const applyRiveString = (nextValue: string) => {
    boundString.setValue(nextValue);

    if (!rive) return;

    try {
      rive.setTextRunValueAtPath(control.path, nextValue, "");
    } catch {
      // Text may be data-bound instead of a direct text run.
    }

    try {
      const viewModel = control.viewModelName
        ? rive.viewModelByName(control.viewModelName)
        : rive.defaultViewModel();
      const instance = rive.viewModelInstance ?? viewModel?.defaultInstance();
      const stringProperty = instance?.string(control.path);

      if (stringProperty) {
        stringProperty.value = nextValue;
      }

      if (instance && rive.viewModelInstance !== instance) {
        rive.bindViewModelInstance(instance);
      }
    } catch {
      // Some files expose no data-binding string properties.
    }
  };

  useEffect(() => {
    setLocalValue(control.defaultValue);
    applyRiveString(control.defaultValue);
  }, [control.defaultValue, control.path, defaultInstance, rive]);

  const updateValue = (nextValue: string) => {
    setLocalValue(nextValue);
    applyRiveString(nextValue);
  };

  return (
    <label className="block rounded-lg border-2 border-[#e5e7f0] bg-white p-3">
      <span className="mb-2 inline-flex items-center gap-2 text-[#474747]">
        <Type className="h-4 w-4" />
        <span className="font-['Gaegu'] text-[20px] leading-[24px]">
          {control.label}
        </span>
      </span>

      {control.multiline ? (
        <textarea
          value={localValue}
          onChange={(event) => updateValue(event.target.value)}
          className="min-h-[72px] w-full resize-y rounded-lg border-2 border-[#e5e7f0] bg-[#f8f9fc] px-4 py-3 font-['Gaegu'] text-[18px] leading-[22px] text-[#474747] outline-none transition-colors focus:border-[#8774ff]"
        />
      ) : (
        <input
          type="text"
          value={localValue}
          onChange={(event) => updateValue(event.target.value)}
          className="h-12 w-full rounded-lg border-2 border-[#e5e7f0] bg-[#f8f9fc] px-4 font-['Gaegu'] text-[18px] text-[#474747] outline-none transition-colors focus:border-[#8774ff]"
        />
      )}
    </label>
  );
}

// Canvas only — no buttons
function RiveCanvas({
  project,
  onRiveChange,
}: {
  project: MotionProject;
  onRiveChange: (rive: RiveInstance | null) => void;
}) {
  const { rive, setCanvasRef } = usePlayableRive(project);
  const isContainedCanvas = project.stage?.canvasMode === "contain";
  const canvasStyle: CSSProperties = isContainedCanvas
    ? {
        display: "block",
        height: "100%",
        width: "100%",
        objectFit: "contain",
        objectPosition: "center",
      }
    : { display: "block" };

  useEffect(() => {
    onRiveChange(rive);
    return () => onRiveChange(null);
  }, [onRiveChange, rive]);

  return (
    <div
      className="relative overflow-hidden rounded-lg border-2 border-[#474747]"
      style={{
        height: project.stage?.height ?? "min(70vw, 420px)",
        minHeight: project.stage?.minHeight ?? 300,
        backgroundColor: project.bgColor,
      }}
    >
      <canvas
        ref={setCanvasRef}
        width={project.stage?.canvasWidth ?? 900}
        height={project.stage?.canvasHeight ?? 600}
        className="h-full w-full"
        style={canvasStyle}
      />
    </div>
  );
}

function MotionProjectItem({ project }: { project: MotionProject }) {
  const [activeRive, setActiveRive] = useState<RiveInstance | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const playbackNames = useMemo(() => {
    if (!activeRive) return undefined;
    return activeRive.stateMachineNames[0] || activeRive.animationNames[0];
  }, [activeRive]);

  const togglePlayback = () => {
    if (!activeRive) return;
    if (isPlaying) {
      activeRive.pause(playbackNames);
    } else {
      activeRive.play(playbackNames);
    }
    setIsPlaying((prev) => !prev);
  };

  const replay = () => {
    if (!activeRive) return;
    activeRive.reset({ autoplay: true, autoBind: true });
    if (playbackNames) activeRive.play(playbackNames);
    setIsPlaying(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="grid md:grid-cols-2 gap-8 items-start"
    >
      {/* Left — canvas only */}
      <RiveCanvas project={project} onRiveChange={setActiveRive} />

      {/* Right — info, controls, buttons */}
      <div className="space-y-4">
        <div className="rounded-lg border-2 border-[#474747] bg-white p-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border-2 border-[#e5e7f0] bg-[#f8f9fc] px-4 py-2 font-['Gaegu'] text-[16px] text-[#474747]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="font-['Solway'] font-bold text-[32px] leading-[38.4px] text-[#474747]">
            {project.title}
          </h3>
          <p className="mt-4 font-['Gaegu'] text-[20px] leading-[24px] text-[#474747]">
            {project.description}
          </p>
        </div>

        {project.numberControls?.map((control) => (
          <NumberBindingControl
            key={control.path}
            control={control}
            accent={project.accent}
            rive={activeRive}
          />
        ))}

        {project.textControls && (
          <div className="grid gap-3 sm:grid-cols-2">
            {project.textControls.map((control) => (
              <TextBindingControl
                key={control.path}
                control={control}
                rive={activeRive}
              />
            ))}
          </div>
        )}

        {/* Playback buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={togglePlayback}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-[#474747] bg-white px-4 py-2 font-['Gaegu'] text-[20px] text-[#474747] transition-transform hover:scale-[1.02]"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
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

          {project.marketplaceUrl && (
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
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function MotionPlaygroundSection() {
  return (
    <section className="px-4 py-16 pb-40 md:px-8 md:py-32 md:pb-48">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-12 md:mb-24">
          <div className="h-[3px] w-[40px] md:w-[87px] bg-[#474747] rounded-full" />
          <h2 className="text-[32px] md:text-[42px] font-['Solway'] text-[#474747] whitespace-nowrap">
            Motion
          </h2>
          <div className="h-[3px] w-[40px] md:w-[87px] bg-[#474747] rounded-full" />
        </div>

        <p className="mx-auto mb-12 max-w-[760px] text-center font-['Gaegu'] text-[20px] leading-[26px] text-[#474747]">
          A Rive animation playground for interactive motion experiments,
          data-bound UI states, loaders, and learning-path prototypes that can
          be played directly inside the portfolio.
        </p>

        <div className="space-y-12 md:space-y-16">
          {motionProjects.map((project) => (
            <MotionProjectItem key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
