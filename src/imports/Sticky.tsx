function Container() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Poppins:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[52px] text-center w-full">
        <p className="leading-[62.4px]">👋</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Container />
    </div>
  );
}

export default function Sticky() {
  return (
    <div className="bg-[#faefcc] relative shadow-[0px_20px_10px_-14px_rgba(64,49,160,0.28)] size-full" data-name="Sticky">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center pb-[33.81px] pt-[32.793px] px-[16px] relative size-full">
          <Container1 />
        </div>
      </div>
    </div>
  );
}