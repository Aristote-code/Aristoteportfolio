import svgPaths from "./svg-1peztmbabf";

function Svg3078530921() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
      <g id="svg3078530921">
        <path d={svgPaths.p58b9800} fill="var(--fill-0, #FAC99C)" id="Vector" />
        <path d={svgPaths.p21bcbd00} id="Vector_2" stroke="var(--stroke-0, black)" strokeMiterlimit="10" strokeOpacity="0.1" />
      </g>
    </svg>
  );
}

function Svg() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="SVG">
      <Svg3078530921 />
    </div>
  );
}

function Cursor() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-center left-[-12px] size-[18px] top-[-12px]" data-name="Cursor">
      <Svg />
    </div>
  );
}

function CursorContainer() {
  return (
    <div className="absolute inset-0" data-name="Cursor container">
      <Cursor />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="capitalize flex flex-col font-['Figtree:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#231f20] text-[13px] text-nowrap tracking-[0.4px]">
        <p className="leading-[16px] whitespace-pre">Aristote</p>
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

function Tag() {
  return (
    <div className="bg-[#fac99c] box-border content-stretch flex items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.04),0px_2px_8px_0px_rgba(0,0,0,0.04)] shrink-0" data-name="Tag">
      <Container1 />
      <div className="absolute inset-0 rounded-[8px]" data-name="Border">
        <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      </div>
    </div>
  );
}

export default function Orange() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[8px] size-full" data-name="Orange">
      <CursorContainer />
      <Tag />
    </div>
  );
}