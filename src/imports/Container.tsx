import svgPaths from "./svg-6g023zi4pn";
import img from "figma:asset/54fdcb887a57e4273d2922978c2fa57753ca68d5.png";

function Bk6HFrabkfGgX5GLgs8Qia62UuUJpg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <img alt="" className="absolute h-full left-[-25.07%] max-w-none top-0 w-[150.15%]" src={img} />
    </div>
  );
}

function Image() {
  return (
    <div className="absolute left-0 overflow-clip size-[268px] top-0" data-name="Image">
      <Bk6HFrabkfGgX5GLgs8Qia62UuUJpg />
    </div>
  );
}

function ImageFrame() {
  return (
    <div className="absolute inset-0 overflow-clip rounded-[8px]" data-name="Image Frame">
      <Image />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="capitalize flex flex-col font-['Poppins:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#8c8fa6] text-[16px] text-nowrap tracking-[3.2px]">
        <p className="leading-[19.2px] whitespace-pre">USE CASE</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container />
    </div>
  );
}

function Background() {
  return (
    <div className="absolute bg-white bottom-[19.19px] box-border content-stretch flex items-center justify-center left-[21px] px-[4px] py-[2px] rounded-[4px]" data-name="Background">
      <Container1 />
      <div className="absolute h-[23.19px] left-0 rounded-[4px] top-0 w-[109.25px]" data-name="Border">
        <div aria-hidden="true" className="absolute border border-[#eaeaf1] border-solid inset-0 pointer-events-none rounded-[4px]" />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 size-[268px]" data-name="Container">
      <ImageFrame />
      <Background />
    </div>
  );
}

function Heading() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pb-[0.6px] pt-0 px-0 relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Solway:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[28px] w-full">
        <p className="leading-[33.6px]">Paragon</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Regular',_sans-serif] justify-center leading-[24px] not-italic relative shrink-0 text-[#8c8fa6] text-[20px] w-full">
        <p className="mb-0">{`Step into the journey of a unique `}</p>
        <p className="mb-0">{`project. Here, I unravel the `}</p>
        <p className="mb-0">{`threads of my thought process and `}</p>
        <p className="mb-0">{`exciting steps taken from inception `}</p>
        <p>to execution.</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col gap-[24px] grow h-[252px] items-start min-h-px min-w-px pb-[42.4px] pt-[31px] px-0 relative shrink-0" data-name="Container">
      <Heading />
      <Container3 />
    </div>
  );
}

function Svg() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 716 302">
      <g id="svg1435461913_528">
        <path d={svgPaths.p151fe80} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.09506" />
      </g>
    </svg>
  );
}

function Component() {
  return (
    <div className="absolute inset-[-9px_-5px_-9px_-11px]" data-name="Component 1">
      <Svg />
    </div>
  );
}

function LinkVariant() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[64px] items-center pl-[8px] pr-[64px] py-[8px] relative rounded-[16px] shrink-0 w-[700px]" data-name="Link - Variant 1">
      <Container2 />
      <Container4 />
      <Component />
    </div>
  );
}

export default function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="Container">
      <LinkVariant />
    </div>
  );
}