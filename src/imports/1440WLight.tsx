import svgPaths from "./svg-s2u9w3lz6s";
import imgLxt5CV4ExoLFdItnoMvZcLHiUrAJpg from "figma:asset/f4137ca7bd1d0607749044c6275f7984126cc429.png";
import imgTitle from "figma:asset/54fdcb887a57e4273d2922978c2fa57753ca68d5.png";
import imgContainer from "figma:asset/b19ff9454eec87c2e5b735acb9527d82f7dc248e.png";
import { imgVector, imgVector1, imgGroup, imgVector2 } from "./svg-dl5x4";

function Component1() {
  return (
    <div className="relative shrink-0 size-[26px]" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
        <g id="Component 1">
          <path d={svgPaths.p127a4d00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ImageFill() {
  return (
    <div className="box-border content-stretch flex flex-col h-[4483.77px] items-start overflow-clip pb-[4457.77px] pl-0 pr-[1414px] pt-0 relative shrink-0 w-[1440px]" data-name="image fill">
      <Component1 />
    </div>
  );
}

function ImageBackground() {
  return (
    <div className="basis-0 bg-white content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0 w-full" data-name="Image+Background">
      <ImageFill />
    </div>
  );
}

function Bg() {
  return (
    <div className="absolute bottom-[-0.02%] content-stretch flex flex-col items-start justify-center left-0 right-0 top-0" data-name="BG">
      <ImageBackground />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="flex flex-col font-['Solway:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[52px] text-nowrap">
        <p className="leading-[62.4px] whitespace-pre">{`Hi, I'm Aristote`}</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Heading1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#8c8fa6] text-[24px] text-center text-nowrap">
        <p className="leading-[28.8px] whitespace-pre">A product designer at Health Connect.</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container1 />
    </div>
  );
}

function TextContainer() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] inset-[2.41%_21.46%_1.59%_21.46%] items-center justify-center overflow-clip" data-name="Text Container">
      <Container />
      <Container2 />
    </div>
  );
}

function Group2() {
  return <div className="absolute bottom-full contents left-0 right-full top-0" data-name="Group" />;
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group2 />
    </div>
  );
}

function Component3() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Component 1">
      <ClipPathGroup />
    </div>
  );
}

function LottieAnimation() {
  return (
    <div className="absolute content-stretch flex flex-col h-[242px] items-start justify-center left-[30px] top-[-140px] w-[204px]" data-name="Lottie Animation">
      <Component3 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="box-border content-stretch flex flex-col font-['Gaegu:Bold',_sans-serif] items-center leading-[0] not-italic pb-[0.998px] pt-0 px-0 relative shrink-0 text-[#474747] text-[20px] text-center text-nowrap w-full" data-name="Paragraph">
      <div className="flex flex-col justify-center mb-[-0.998px] relative shrink-0">
        <p className="leading-[24px] text-nowrap whitespace-pre">Available</p>
      </div>
      <div className="flex flex-col justify-center mb-[-0.998px] relative shrink-0">
        <p className="leading-[24px] text-nowrap whitespace-pre">for hiring</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph />
    </div>
  );
}

function Sticky() {
  return (
    <div className="bg-[#b8ffc6] box-border content-stretch flex flex-col items-center justify-center overflow-clip pb-[41.003px] pt-[40.998px] px-[16px] relative shadow-[0px_20px_10px_-14px_rgba(64,49,160,0.28)] w-full" data-name="Sticky">
      <Container3 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Poppins:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[52px] text-center w-full">
        <p className="leading-[62.4px]">👋</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Container4 />
    </div>
  );
}

function Sticky1() {
  return (
    <div className="bg-[#faefcc] box-border content-stretch flex flex-col items-center justify-center overflow-clip pb-[33.81px] pt-[32.793px] px-[16px] relative shadow-[0px_20px_10px_-14px_rgba(64,49,160,0.28)] size-[130px]" data-name="Sticky">
      <Container5 />
    </div>
  );
}

function StickiesContainer() {
  return (
    <div className="absolute bottom-[-186px] h-[246px] right-0 w-[257px]" data-name="Stickies Container">
      <div className="absolute bottom-[0.56px] flex items-center justify-center left-[0.87px] top-[85.6px] w-[160.522px]">
        <div className="flex-none h-[129.002px] rotate-[16deg] w-[130px]">
          <Sticky />
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.10452800244092941)+(var(--transform-inner-height)*0.994521975517273)))] items-center justify-center left-[114.56px] top-[-0.44px] w-[calc(1px*((var(--transform-inner-height)*0.10452800244092941)+(var(--transform-inner-width)*0.994521975517273)))]" style={{ "--transform-inner-width": "130", "--transform-inner-height": "130" } as React.CSSProperties}>
        <div className="flex-none rotate-[354deg]">
          <Sticky1 />
        </div>
      </div>
    </div>
  );
}

function HeroContainer() {
  return (
    <div className="h-[100px] relative shrink-0 w-[720px]" data-name="Hero Container">
      <TextContainer />
      <LottieAnimation />
      <StickiesContainer />
    </div>
  );
}

function HeaderHome() {
  return (
    <div className="content-stretch flex h-[900px] items-center justify-center relative shrink-0 w-[720px]" data-name="Header - Home">
      <HeroContainer />
    </div>
  );
}

function Svg259040237249() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 87 5">
      <g clipPath="url(#clip0_5_1355)" id="svg-259040237_249">
        <path d={svgPaths.p160d8940} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      </g>
      <defs>
        <clipPath id="clip0_5_1355">
          <rect fill="white" height="5" width="87" />
        </clipPath>
      </defs>
    </svg>
  );
}

function Component4() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Component 1">
      <Svg259040237249 />
    </div>
  );
}

function Separator() {
  return (
    <div className="content-stretch flex flex-col h-[5px] items-start justify-center relative shrink-0 w-[87px]" data-name="Separator">
      <Component4 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Solway:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[42px] text-nowrap">
        <p className="leading-[50.4px] whitespace-pre">About</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Heading2 />
    </div>
  );
}

function Svg734246484246() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 87 5">
      <g clipPath="url(#clip0_5_1352)" id="svg-734246484_246">
        <path d={svgPaths.p272fcb00} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      </g>
      <defs>
        <clipPath id="clip0_5_1352">
          <rect fill="white" height="5" width="87" />
        </clipPath>
      </defs>
    </svg>
  );
}

function Component5() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Component 1">
      <Svg734246484246 />
    </div>
  );
}

function Separator1() {
  return (
    <div className="content-stretch flex flex-col h-[5px] items-start justify-center relative shrink-0 w-[87px]" data-name="Separator">
      <Component5 />
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex gap-[32px] items-center justify-center relative shrink-0 w-full" data-name="Title">
      <Separator />
      <Container6 />
      <Separator1 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pb-[0.59px] pt-0 px-0 relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Solway:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[28px] text-nowrap">
        <p className="leading-[33.6px] whitespace-pre">Links</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Heading3 />
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute inset-0 overflow-clip rounded-[16px]" data-name="Container">
      <div className="absolute left-0 rounded-[16px] size-[40px] top-0" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[#474747] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
    </div>
  );
}

function LinkSocialIcon() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[40px]" data-name="Link - Social Icon">
      <Container8 />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <LinkSocialIcon />
    </div>
  );
}

function Socials() {
  return (
    <div className="content-stretch flex gap-[16px] h-[40px] items-center justify-center relative shrink-0" data-name="Socials">
      {[...Array(4).keys()].map((_, i) => (
        <Container9 key={i} />
      ))}
    </div>
  );
}

function Links() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Links">
      <Container7 />
      <Socials />
    </div>
  );
}

function Heading5() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pb-[0.6px] pt-0 px-0 relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Solway:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[28px] text-nowrap">
        <p className="leading-[33.6px] whitespace-pre">Skills</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Heading5 />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[24px] text-nowrap">
        <p className="leading-[28.8px] whitespace-pre">Framer</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container17 />
    </div>
  );
}

function Label() {
  return (
    <div className="box-border content-stretch flex items-center justify-center overflow-clip px-[16px] py-[8px] relative rounded-[16px] shrink-0" data-name="Label">
      <Container18 />
      <div className="absolute bottom-[-0.57%] left-0 right-0 rounded-[16px] top-0" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[#474747] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[24px] text-nowrap">
        <p className="leading-[28.8px] whitespace-pre">UI design</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container19 />
    </div>
  );
}

function Label1() {
  return (
    <div className="box-border content-stretch flex items-center justify-center overflow-clip px-[16px] py-[8px] relative rounded-[16px] shrink-0" data-name="Label">
      <Container20 />
      <div className="absolute bottom-[-0.83%] left-0 right-0 rounded-[16px] top-0" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[#474747] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
    </div>
  );
}

function Row() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Row">
      <Label />
      <Label1 />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[24px] text-nowrap">
        <p className="leading-[28.8px] whitespace-pre">UX research</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container21 />
    </div>
  );
}

function Label2() {
  return (
    <div className="box-border content-stretch flex items-center justify-center overflow-clip px-[16px] py-[8px] relative rounded-[16px] shrink-0" data-name="Label">
      <Container22 />
      <div className="absolute bottom-[-1.05%] left-0 right-0 rounded-[16px] top-0" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[#474747] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[24px] text-nowrap">
        <p className="leading-[28.8px] whitespace-pre">Animation</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container23 />
    </div>
  );
}

function Label3() {
  return (
    <div className="box-border content-stretch flex items-center justify-center overflow-clip px-[16px] py-[8px] relative rounded-[16px] shrink-0" data-name="Label">
      <Container24 />
      <div className="absolute bottom-[-0.82%] left-0 right-0 rounded-[16px] top-0" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[#474747] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
    </div>
  );
}

function Row1() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Row">
      <Label2 />
      <Label3 />
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[24px] text-nowrap">
        <p className="leading-[28.8px] whitespace-pre">Animation</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container25 />
    </div>
  );
}

function Label4() {
  return (
    <div className="box-border content-stretch flex items-center justify-center overflow-clip px-[16px] py-[8px] relative rounded-[16px] shrink-0" data-name="Label">
      <Container26 />
      <div className="absolute bottom-[-0.84%] left-0 right-0 rounded-[16px] top-0" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[#474747] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[24px] text-nowrap">
        <p className="leading-[28.8px] whitespace-pre">Branding</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container27 />
    </div>
  );
}

function Label5() {
  return (
    <div className="box-border content-stretch flex items-center justify-center overflow-clip px-[16px] py-[8px] relative rounded-[16px] shrink-0" data-name="Label">
      <Container28 />
      <div className="absolute bottom-[-0.74%] left-0 right-0 rounded-[16px] top-0" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[#474747] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Row">
      <Label4 />
      <Label5 />
    </div>
  );
}

function Labels() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Labels">
      <Row />
      <Row1 />
      <Row2 />
    </div>
  );
}

function Skills() {
  return (
    <div className="content-stretch flex flex-col gap-[24.01px] items-start relative shrink-0 w-full" data-name="Skills">
      <Container16 />
      <Labels />
    </div>
  );
}

function Heading6() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pb-[0.59px] pt-0 px-0 relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Solway:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[28px] text-nowrap">
        <p className="leading-[33.6px] whitespace-pre">Experience</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Heading6 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Solway:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[20px] text-nowrap">
        <p className="leading-[28px] whitespace-pre">Health Connect</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-[calc(50%-40.39px)] translate-y-[-50%]" data-name="Container">
      <Heading4 />
    </div>
  );
}

function Container31() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pb-[0.6px] pt-0 px-0 relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[18px] text-nowrap">
        <p className="leading-[21.6px] whitespace-pre">Senior Product Designer</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container31 />
    </div>
  );
}

function Container33() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pb-[0.6px] pt-0 px-0 relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#8c8fa6] text-[16px] text-nowrap tracking-[-0.64px]">
        <p className="leading-[21.6px] whitespace-pre">Aug 2025 - Current</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container33 />
    </div>
  );
}

function Position() {
  return (
    <div className="absolute box-border content-stretch flex gap-[16px] h-[21.6px] items-center left-0 overflow-clip pb-px pt-0 px-0 top-[calc(50%-7.59px)] translate-y-[-50%]" data-name="Position">
      <Container32 />
      <Container34 />
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Regular',_sans-serif] justify-center leading-[21.6px] not-italic relative shrink-0 text-[#8c8fa6] text-[18px] w-full">
        <p className="mb-0">{`I developed user-focused delightful digital `}</p>
        <p>experiences.</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-[64.39px] w-[328px]" data-name="Container">
      <Container35 />
    </div>
  );
}

function Job() {
  return (
    <div className="h-[108.78px] relative shrink-0 w-[328px]" data-name="Job">
      <Container30 />
      <Position />
      <Container36 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Solway:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[20px] text-nowrap">
        <p className="leading-[28px] whitespace-pre">Acme</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-0" data-name="Container">
      <Heading7 />
    </div>
  );
}

function Container38() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pb-[0.6px] pt-0 px-0 relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[18px] text-nowrap">
        <p className="leading-[21.6px] whitespace-pre">Lead Product Designer</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container38 />
    </div>
  );
}

function Container40() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pb-[0.6px] pt-0 px-0 relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Bold',_'Noto_Sans:Bold',_sans-serif] justify-center leading-[0] relative shrink-0 text-[#8c8fa6] text-[16px] text-nowrap tracking-[-0.64px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 700" }}>
        <p className="leading-[21.6px] whitespace-pre">Feb 2023 – July 2025</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container40 />
    </div>
  );
}

function Position1() {
  return (
    <div className="absolute box-border content-stretch flex gap-[16px] h-[21.6px] items-center left-0 overflow-clip pb-px pt-0 px-0 top-[calc(50%-7.59px)] translate-y-[-50%]" data-name="Position">
      <Container39 />
      <Container41 />
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Regular',_sans-serif] justify-center leading-[21.6px] not-italic relative shrink-0 text-[#8c8fa6] text-[18px] w-full">
        <p className="mb-0">{`Lead the initiative to develop Acme mobile `}</p>
        <p>application interface.</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-[64.39px] w-[328px]" data-name="Container">
      <Container42 />
    </div>
  );
}

function Job1() {
  return (
    <div className="h-[108.78px] overflow-clip relative shrink-0 w-[328px]" data-name="Job">
      <Container37 />
      <Position1 />
      <Container43 />
    </div>
  );
}

function Arrow() {
  return <div className="shrink-0 size-[24px] z-[2]" data-name="arrow" />;
}

function Container44() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[24px] text-nowrap">
        <p className="leading-[28.8px] whitespace-pre">Download Resume</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container44 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[12.25%_12.51%_60.06%_73.33%]" data-name="Group">
      <div className="absolute inset-[12.25%_12.51%_60.06%_73.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-19.929px_-26.85px] mask-size-[43.158px_39.676px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-12.6%_-33.1%_-12.6%_-33.09%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 13">
            <path d={svgPaths.p230f4700} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.43726" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[26.74%_39.77%_52.35%_7.81%]" data-name="Group">
      <div className="absolute inset-[26.74%_39.77%_52.35%_7.81%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-21.007px_-10.647px] mask-size-[43.158px_39.676px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-16.69%_-8.94%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 10">
            <path d={svgPaths.p1b2ec900} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.43726" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-[79.69%_36.1%_9.35%_36.45%]" data-name="Group">
      <div className="absolute inset-[79.69%_36.1%_9.35%_36.45%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-7.407px_-9.877px] mask-size-[43.158px_39.676px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-31.82%_-17.08%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 7">
            <path d={svgPaths.p30cc11e0} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.43726" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-[12.25%_12.51%_9.35%_7.81%]" data-name="Group">
      <Group5 />
      <Group6 />
      <Group7 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[12.25%_12.5%_9.35%_7.81%]" data-name="Group">
      <Group8 />
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group9 />
    </div>
  );
}

function Component6() {
  return (
    <div className="h-[34.934px] relative shrink-0 w-full" data-name="Component 1">
      <ClipPathGroup1 />
    </div>
  );
}

function Container46() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pb-[2.994px] pt-0 px-0 relative w-[25.997px]" data-name="Container">
      <Component6 />
    </div>
  );
}

function Effect() {
  return (
    <div className="h-[42px] relative shrink-0 w-px" data-name="Effect">
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.8746196031570435)+(var(--transform-inner-height)*0.4848097860813141)))] items-center justify-center right-[-26.89px] top-[-17.6px] w-[calc(1px*((var(--transform-inner-height)*0.8746196031570435)+(var(--transform-inner-width)*0.4848097860813141)))]" style={{ "--transform-inner-width": "25.984375", "--transform-inner-height": "37.921875" } as React.CSSProperties}>
        <div className="flex-none rotate-[119deg]">
          <Container46 />
        </div>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex gap-[4px] h-[42px] items-center relative shrink-0 z-[1]" data-name="Container">
      <Container45 />
      <Effect />
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex gap-[10px] h-[42px] isolate items-center justify-center relative shrink-0" data-name="Container">
      <Arrow />
      <Container47 />
    </div>
  );
}

function LinkVariant1() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-center min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Link - Variant 1">
      <Container48 />
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start justify-center relative shrink-0" data-name="Container">
      <LinkVariant1 />
    </div>
  );
}

function Experience() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-name="Experience">
      <Container29 />
      <Job />
      <Job1 />
      <Container49 />
    </div>
  );
}

function Section2() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col gap-[63px] items-start right-0 top-[-1px]" data-name="Section 2">
      <Links />
      <Skills />
      <Experience />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="font-['Gaegu:Bold',_sans-serif] h-[48px] leading-[0] not-italic relative shrink-0 text-[#474747] text-[20px] text-center w-full" data-name="Paragraph">
      <div className="absolute flex flex-col h-[24px] justify-center left-[calc(50%+4.359px)] top-[12px] translate-x-[-50%] translate-y-[-50%] w-[83.218px]">
        <p className="leading-[24px]">{`5+ years `}</p>
      </div>
      <div className="absolute flex flex-col h-[24px] justify-center left-[calc(50%+0.174px)] top-[36px] translate-x-[-50%] translate-y-[-50%] w-[90.089px]">
        <p className="leading-[24px]">in startups</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph1 />
    </div>
  );
}

function Sticky2() {
  return (
    <div className="absolute bg-[#b8ffc6] box-border content-stretch flex flex-col items-center justify-center left-[45px] overflow-clip p-[16px] shadow-[0px_20px_10px_-14px_rgba(64,49,160,0.28)] size-[130px] top-[286px]" data-name="Sticky">
      <Container50 />
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[20px] text-center w-full">
        <p className="leading-[24px]">Kigali</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="absolute bottom-[27px] content-stretch flex flex-col items-start left-1/2 translate-x-[-50%] w-[98px]" data-name="Container">
      <Container51 />
    </div>
  );
}

function Svg1433061640297() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 38">
      <g id="svg1433061640_297">
        <path d={svgPaths.p5046880} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      </g>
    </svg>
  );
}

function Component7() {
  return (
    <div className="absolute inset-0" data-name="Component 1">
      <Svg1433061640297 />
    </div>
  );
}

function Svg1861838039419() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 13">
      <g id="svg-1861838039_419">
        <path d={svgPaths.pb1a62a8} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      </g>
    </svg>
  );
}

function Component8() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Component 1">
      <Svg1861838039419 />
    </div>
  );
}

function Vector() {
  return (
    <div className="absolute content-stretch flex flex-col h-[13px] items-start justify-center left-[6px] top-[6px] w-[12px]" data-name="Vector">
      <Component8 />
    </div>
  );
}

function Container53() {
  return (
    <div className="absolute h-[38px] left-[50.5px] overflow-clip top-[33px] w-[25px]" data-name="Container">
      <Component7 />
      <Vector />
    </div>
  );
}

function Sticky3() {
  return (
    <div className="absolute bg-[#94e6ff] bottom-[253px] left-[138px] overflow-clip shadow-[0px_20px_10px_-14px_rgba(64,49,160,0.28)] size-[130px]" data-name="Sticky">
      <Container52 />
      <Container53 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="font-['Gaegu:Bold',_sans-serif] h-[48px] leading-[0] not-italic relative shrink-0 text-[#474747] text-[20px] text-center w-full" data-name="Paragraph">
      <div className="absolute flex flex-col h-[24px] justify-center left-[calc(50%+4.357px)] top-[12px] translate-x-[-50%] translate-y-[-50%] w-[80.894px]">
        <p className="leading-[24px]">{`versatile `}</p>
      </div>
      <div className="absolute flex flex-col h-[24px] justify-center left-[calc(50%+0.153px)] top-[36px] translate-x-[-50%] translate-y-[-50%] w-[75.646px]">
        <p className="leading-[24px]">skill pool</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph2 />
    </div>
  );
}

function Sticky4() {
  return (
    <div className="absolute bg-[#ffa3a3] box-border content-stretch flex flex-col items-center justify-center left-[182px] overflow-clip p-[16px] shadow-[0px_20px_10px_-14px_rgba(64,49,160,0.28)] size-[130px] top-[323px]" data-name="Sticky">
      <Container54 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[120px] relative shrink-0 w-full" data-name="Paragraph">
      <div className="absolute flex flex-col font-['Gaegu:Bold',_sans-serif] h-[120px] justify-center leading-[24px] left-[calc(50%+4.304px)] not-italic text-[#474747] text-[20px] text-center top-[60px] translate-x-[-50%] translate-y-[-50%] w-[97.35px]">
        <p className="mb-0">{`Over five years of `}</p>
        <p className="mb-0">{`experience `}</p>
        <p>in the industry</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph3 />
    </div>
  );
}

function Sticky5() {
  return (
    <div className="absolute bg-[#ffe5a3] bottom-[311px] box-border content-stretch flex flex-col items-center justify-center left-[24px] overflow-clip p-[16px] shadow-[0px_20px_10px_-14px_rgba(64,49,160,0.28)] size-[130px]" data-name="Sticky">
      <Container55 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="font-['Gaegu:Bold',_sans-serif] h-[48px] leading-[0] not-italic relative shrink-0 text-[#474747] text-[20px] text-center w-full" data-name="Paragraph">
      <div className="absolute flex flex-col h-[24px] justify-center left-[calc(50%+4.352px)] top-[12px] translate-x-[-50%] translate-y-[-50%] w-[67.443px]">
        <p className="leading-[24px]">{`Framer `}</p>
      </div>
      <div className="absolute flex flex-col h-[24px] justify-center left-[calc(50%+0.187px)] top-[36px] translate-x-[-50%] translate-y-[-50%] w-[60.274px]">
        <p className="leading-[24px]">partner</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph4 />
    </div>
  );
}

function Sticky6() {
  return (
    <div className="absolute bg-[#cda3ff] bottom-[106px] box-border content-stretch flex flex-col items-center justify-center left-[88.98px] overflow-clip p-[16px] shadow-[0px_20px_10px_-14px_rgba(64,49,160,0.28)] size-[130px]" data-name="Sticky">
      <Container56 />
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[20px] text-center w-full">
        <p className="leading-[24px]">sticky</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Container57 />
    </div>
  );
}

function Sticky7() {
  return (
    <div className="absolute bg-[#fbff94] bottom-[7px] box-border content-stretch flex flex-col items-center justify-center left-[177px] overflow-clip p-[16px] shadow-[0px_20px_10px_-14px_rgba(64,49,160,0.28)] size-[130px]" data-name="Sticky">
      <Container58 />
    </div>
  );
}

function Lxt5CV4ExoLFdItnoMvZcLHiUrAJpg() {
  return (
    <div className="absolute inset-0 rounded-[183px]" data-name="LXT5cV4ExoLFdItnoMVZcLHiUrA.jpg">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[183px]">
        <img alt="" className="absolute h-full left-[-25.07%] max-w-none top-0 w-[150.15%]" src={imgLxt5CV4ExoLFdItnoMvZcLHiUrAJpg} />
      </div>
    </div>
  );
}

function Image() {
  return (
    <div className="absolute left-[35px] rounded-[183px] size-[119px] top-[28px]" data-name="Image">
      <Lxt5CV4ExoLFdItnoMvZcLHiUrAJpg />
      <div className="absolute left-0 rounded-[183px] size-[119px] top-0" data-name="Border">
        <div aria-hidden="true" className="absolute border-[#474747] border-[3px] border-solid inset-0 pointer-events-none rounded-[183px]" />
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[32px] text-center text-nowrap">
        <p className="leading-[38.4px] whitespace-pre">Yours Truly</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="absolute bottom-[-0.61px] content-stretch flex flex-col items-start right-[7.34px]" data-name="Container">
      <Container59 />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents inset-[10.7%_6.95%_5.74%_6.64%]" data-name="Group">
      <div className="absolute inset-[10.7%_6.95%_5.74%_6.64%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-4.582px_-8.645px] mask-size-[69px_80.829px]" data-name="Vector" style={{ maskImage: `url('${imgVector1}')` }}>
        <div className="absolute inset-[-2.19%_-2.48%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 63 71">
            <path d={svgPaths.p2365ee80} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.95714" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents inset-[5.49%_47.26%_72.45%_6.43%]" data-name="Group">
      <div className="absolute inset-[5.49%_47.26%_72.45%_6.43%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-4.438px_-4.434px] mask-size-[69px_80.829px]" data-name="Vector" style={{ maskImage: `url('${imgVector1}')` }}>
        <div className="absolute inset-[-8.29%_-4.63%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 21">
            <path d={svgPaths.p39bb8040} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.95714" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents inset-[5.49%_6.95%_5.74%_6.43%]" data-name="Group">
      <Group10 />
      <Group11 />
    </div>
  );
}

function ClipPathGroup2() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group12 />
    </div>
  );
}

function Component9() {
  return (
    <div className="h-[80.828px] relative shrink-0 w-full" data-name="Component 1">
      <ClipPathGroup2 />
    </div>
  );
}

function Container61() {
  return (
    <div className="absolute bottom-[8px] box-border content-stretch flex flex-col items-start left-0 pb-[3px] pt-0 px-0 w-[69px]" data-name="Container">
      <Component9 />
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute inset-[12.25%_12.51%_60.06%_73.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-32.422px_-15.023px] mask-size-[47.621px_52.681px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <div className="absolute inset-[-12.6%_-33.1%_-12.61%_-33.09%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 15">
          <g id="Group">
            <path d={svgPaths.p1a6118e8} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.00081" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute inset-[26.74%_39.77%_52.35%_7.81%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-12.117px_-11.434px] mask-size-[47.621px_52.681px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <div className="absolute inset-[-16.69%_-8.94%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 12">
          <g id="Group">
            <path d={svgPaths.p3bece1c0} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.00081" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute inset-[79.69%_36.11%_9.35%_36.45%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-12.25px_-35.914px] mask-size-[47.621px_52.681px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <div className="absolute inset-[-31.83%_-17.08%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 8">
          <g id="Group">
            <path d={svgPaths.p29effc80} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.00081" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute contents inset-[12.25%_12.5%_9.35%_7.81%]" data-name="Group">
      <Group15 />
      <Group16 />
      <Group17 />
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute contents inset-[12.25%_12.5%_9.35%_7.81%]" data-name="Group">
      <Group18 />
    </div>
  );
}

function ClipPathGroup3() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group19 />
    </div>
  );
}

function Component10() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Component 1">
      <ClipPathGroup3 />
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex flex-col h-[43.002px] items-start justify-center relative w-[32.009px]" data-name="Container">
      <Component10 />
    </div>
  );
}

function Variant1() {
  return (
    <div className="absolute h-[231px] left-[60.61px] top-[17px] w-[233px]" data-name="Variant 1">
      <Image />
      <Container60 />
      <Container61 />
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.43837103247642517)+(var(--transform-inner-height)*0.8987941145896912)))] items-center justify-center left-[18.19px] top-[-4.84px] w-[calc(1px*((var(--transform-inner-height)*0.43837103247642517)+(var(--transform-inner-width)*0.8987941145896912)))]" style={{ "--transform-inner-width": "32", "--transform-inner-height": "43" } as React.CSSProperties}>
        <div className="flex-none rotate-[26deg]">
          <Container62 />
        </div>
      </div>
    </div>
  );
}

function Section1() {
  return (
    <div className="absolute bottom-0 left-0 top-0 w-[328px]" data-name="Section 1">
      <Sticky2 />
      <Sticky3 />
      <Sticky4 />
      <Sticky5 />
      <Sticky6 />
      <Sticky7 />
      <Variant1 />
    </div>
  );
}

function Container63() {
  return (
    <div className="h-[888px] relative shrink-0 w-full" data-name="Container">
      <Section2 />
      <Section1 />
    </div>
  );
}

function SectionAbout() {
  return (
    <div className="content-stretch flex flex-col gap-[100px] items-center justify-center relative shrink-0 w-full" data-name="Section - About">
      <Title />
      <Container63 />
    </div>
  );
}

function Svg259040237250() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 87 5">
      <g clipPath="url(#clip0_5_1355)" id="svg-259040237_249">
        <path d={svgPaths.p160d8940} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      </g>
      <defs>
        <clipPath id="clip0_5_1355">
          <rect fill="white" height="5" width="87" />
        </clipPath>
      </defs>
    </svg>
  );
}

function Component11() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Component 1">
      <Svg259040237250 />
    </div>
  );
}

function Separator2() {
  return (
    <div className="content-stretch flex flex-col h-[5px] items-start justify-center relative shrink-0 w-[87px]" data-name="Separator">
      <Component11 />
    </div>
  );
}

function Heading8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Solway:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[42px] text-nowrap">
        <p className="leading-[50.4px] whitespace-pre">Projects</p>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Heading8 />
    </div>
  );
}

function Svg734246484247() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 87 5">
      <g clipPath="url(#clip0_5_1352)" id="svg-734246484_246">
        <path d={svgPaths.p272fcb00} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      </g>
      <defs>
        <clipPath id="clip0_5_1352">
          <rect fill="white" height="5" width="87" />
        </clipPath>
      </defs>
    </svg>
  );
}

function Component12() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Component 1">
      <Svg734246484247 />
    </div>
  );
}

function Separator3() {
  return (
    <div className="content-stretch flex flex-col h-[5px] items-start justify-center relative shrink-0 w-[87px]" data-name="Separator">
      <Component12 />
    </div>
  );
}

function Title1() {
  return (
    <div className="content-stretch flex gap-[32px] items-center justify-center relative shrink-0 w-full" data-name="Title">
      <Separator2 />
      <Container64 />
      <Separator3 />
    </div>
  );
}

function Bk6HFrabkfGgX5GLgs8Qia62UuUJpg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <img alt="" className="absolute h-full left-[-25.07%] max-w-none top-0 w-[150.15%]" src={imgTitle} />
    </div>
  );
}

function Image1() {
  return (
    <div className="absolute left-0 overflow-clip size-[268px] top-0" data-name="Image">
      <Bk6HFrabkfGgX5GLgs8Qia62UuUJpg />
    </div>
  );
}

function ImageFrame() {
  return (
    <div className="absolute inset-0 overflow-clip rounded-[8px]" data-name="Image Frame">
      <Image1 />
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="capitalize flex flex-col font-['Poppins:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#8c8fa6] text-[16px] text-nowrap tracking-[3.2px]">
        <p className="leading-[19.2px] whitespace-pre">USE CASE</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container65 />
    </div>
  );
}

function Background() {
  return (
    <div className="absolute bg-white bottom-[19.19px] box-border content-stretch flex items-center justify-center left-[21px] px-[4px] py-[2px] rounded-[4px]" data-name="Background">
      <Container66 />
      <div className="absolute h-[23.19px] left-0 rounded-[4px] top-0 w-[109.25px]" data-name="Border">
        <div aria-hidden="true" className="absolute border border-[#eaeaf1] border-solid inset-0 pointer-events-none rounded-[4px]" />
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="relative shrink-0 size-[268px]" data-name="Container">
      <ImageFrame />
      <Background />
    </div>
  );
}

function Heading9() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pb-[0.6px] pt-0 px-0 relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Solway:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[28px] w-full">
        <p className="leading-[33.6px]">Paragon</p>
      </div>
    </div>
  );
}

function Container68() {
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

function Container69() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col gap-[24px] grow h-[252px] items-start min-h-px min-w-px pb-[42.4px] pt-[31px] px-0 relative shrink-0" data-name="Container">
      <Heading9 />
      <Container68 />
    </div>
  );
}

function Svg1435461913528() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 716 302">
      <g id="svg1435461913_528">
        <path d={svgPaths.p151fe80} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.09506" />
      </g>
    </svg>
  );
}

function Component13() {
  return (
    <div className="absolute inset-[-9px_-5px_-9px_-11px]" data-name="Component 1">
      <Svg1435461913528 />
    </div>
  );
}

function LinkVariant2() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[64px] items-center pl-[8px] pr-[64px] py-[8px] relative rounded-[16px] shrink-0 w-[700px]" data-name="Link - Variant 1">
      <Container67 />
      <Container69 />
      <Component13 />
    </div>
  );
}

function Container70() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <LinkVariant2 />
    </div>
  );
}

function Component95Nn3YpUrXkeWopdXx0MJsJ6OCwPng() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgContainer} />
    </div>
  );
}

function Image2() {
  return (
    <div className="absolute left-0 overflow-clip size-[268px] top-0" data-name="Image">
      <Component95Nn3YpUrXkeWopdXx0MJsJ6OCwPng />
    </div>
  );
}

function ImageFrame1() {
  return (
    <div className="absolute inset-0 overflow-clip rounded-[8px]" data-name="Image Frame">
      <Image2 />
    </div>
  );
}

function Container71() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="capitalize flex flex-col font-['Poppins:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#8c8fa6] text-[16px] text-nowrap tracking-[3.2px]">
        <p className="leading-[19.2px] whitespace-pre">TEMPLATE</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container71 />
    </div>
  );
}

function Background1() {
  return (
    <div className="absolute bg-white bottom-[19.19px] box-border content-stretch flex items-center justify-center left-[21px] px-[4px] py-[2px] rounded-[4px]" data-name="Background">
      <Container72 />
      <div className="absolute h-[23.19px] left-0 rounded-[4px] top-0 w-[113.92px]" data-name="Border">
        <div aria-hidden="true" className="absolute border border-[#eaeaf1] border-solid inset-0 pointer-events-none rounded-[4px]" />
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="relative shrink-0 size-[268px]" data-name="Container">
      <ImageFrame1 />
      <Background1 />
    </div>
  );
}

function Heading10() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pb-[0.6px] pt-0 px-0 relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Solway:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[28px] w-full">
        <p className="leading-[33.6px]">Enchant</p>
      </div>
    </div>
  );
}

function Container74() {
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

function Container75() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col gap-[24px] grow h-[252px] items-start min-h-px min-w-px pb-[42.4px] pt-[31px] px-0 relative shrink-0" data-name="Container">
      <Heading10 />
      <Container74 />
    </div>
  );
}

function Svg1435461913529() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 716 302">
      <g id="svg1435461913_528">
        <path d={svgPaths.p151fe80} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.09506" />
      </g>
    </svg>
  );
}

function Component14() {
  return (
    <div className="absolute inset-[-9px_-5px_-9px_-11px]" data-name="Component 1">
      <Svg1435461913529 />
    </div>
  );
}

function LinkVariant3() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[64px] items-center pl-[8px] pr-[64px] py-[8px] relative rounded-[16px] shrink-0 w-[700px]" data-name="Link - Variant 1">
      <Container73 />
      <Container75 />
      <Component14 />
    </div>
  );
}

function Container76() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <LinkVariant3 />
    </div>
  );
}

function ProjectsListCms() {
  return (
    <div className="relative shrink-0 w-full" data-name="Projects List - CMS">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[64px] items-center px-[20px] py-0 relative w-full">
          <Container70 />
          <Container76 />
        </div>
      </div>
    </div>
  );
}

function Arrow1() {
  return <div className="shrink-0 size-[24px] z-[2]" data-name="arrow" />;
}

function Container77() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[24px] text-nowrap">
        <p className="leading-[28.8px] whitespace-pre">View all projects</p>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container77 />
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute contents inset-[12.25%_12.51%_60.07%_73.33%]" data-name="Group">
      <div className="absolute inset-[12.25%_12.51%_60.07%_73.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-19.933px_-26.854px] mask-size-[43.166px_39.684px]" data-name="Vector" style={{ maskImage: `url('${imgVector2}')` }}>
        <div className="absolute inset-[-12.6%_-33.1%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 13">
            <path d={svgPaths.p1c55eee0} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.43772" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group23() {
  return (
    <div className="absolute contents inset-[26.74%_39.77%_52.35%_7.81%]" data-name="Group">
      <div className="absolute inset-[26.74%_39.77%_52.35%_7.81%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-21.009px_-10.646px] mask-size-[43.166px_39.684px]" data-name="Vector" style={{ maskImage: `url('${imgVector2}')` }}>
        <div className="absolute inset-[-16.69%_-8.94%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 10">
            <path d={svgPaths.p30decd00} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.43772" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group24() {
  return (
    <div className="absolute contents inset-[79.69%_36.11%_9.35%_36.45%]" data-name="Group">
      <div className="absolute inset-[79.69%_36.11%_9.35%_36.45%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-7.407px_-9.877px] mask-size-[43.166px_39.684px]" data-name="Vector" style={{ maskImage: `url('${imgVector2}')` }}>
        <div className="absolute inset-[-31.83%_-17.08%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 7">
            <path d={svgPaths.p1a91f880} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.43772" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute contents inset-[12.25%_12.51%_9.35%_7.82%]" data-name="Group">
      <Group22 />
      <Group23 />
      <Group24 />
    </div>
  );
}

function Group26() {
  return (
    <div className="absolute contents inset-[12.25%_12.51%_9.34%_7.81%]" data-name="Group">
      <Group25 />
    </div>
  );
}

function ClipPathGroup4() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group26 />
    </div>
  );
}

function Component15() {
  return (
    <div className="h-[34.941px] relative shrink-0 w-full" data-name="Component 1">
      <ClipPathGroup4 />
    </div>
  );
}

function Container79() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pb-[3.008px] pt-0 px-0 relative w-[26.002px]" data-name="Container">
      <Component15 />
    </div>
  );
}

function Effect1() {
  return (
    <div className="h-[42px] relative shrink-0 w-px" data-name="Effect">
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.8746196031570435)+(var(--transform-inner-height)*0.4848097860813141)))] items-center justify-center right-[-26.9px] top-[-17.6px] w-[calc(1px*((var(--transform-inner-height)*0.8746196031570435)+(var(--transform-inner-width)*0.4848097860813141)))]" style={{ "--transform-inner-width": "26", "--transform-inner-height": "37.9375" } as React.CSSProperties}>
        <div className="flex-none rotate-[119deg]">
          <Container79 />
        </div>
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="content-stretch flex gap-[4px] h-[42px] items-center relative shrink-0 z-[1]" data-name="Container">
      <Container78 />
      <Effect1 />
    </div>
  );
}

function Container81() {
  return (
    <div className="content-stretch flex gap-[10px] h-[42px] isolate items-center justify-center relative shrink-0" data-name="Container">
      <Arrow1 />
      <Container80 />
    </div>
  );
}

function LinkVariant4() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-center min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Link - Variant 1">
      <Container81 />
    </div>
  );
}

function Container82() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start justify-center relative shrink-0" data-name="Container">
      <LinkVariant4 />
    </div>
  );
}

function CtaContainer() {
  return (
    <div className="content-stretch flex h-[47px] items-center justify-center relative shrink-0 w-full" data-name="CTA Container">
      <Container82 />
    </div>
  );
}

function SectionProjects() {
  return (
    <div className="content-stretch flex flex-col gap-[100px] items-center justify-center relative shrink-0 w-full" data-name="Section - Projects">
      <Title1 />
      <ProjectsListCms />
      <CtaContainer />
    </div>
  );
}

function Svg259040237251() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 87 5">
      <g clipPath="url(#clip0_5_1355)" id="svg-259040237_249">
        <path d={svgPaths.p160d8940} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      </g>
      <defs>
        <clipPath id="clip0_5_1355">
          <rect fill="white" height="5" width="87" />
        </clipPath>
      </defs>
    </svg>
  );
}

function Component16() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Component 1">
      <Svg259040237251 />
    </div>
  );
}

function Separator4() {
  return (
    <div className="content-stretch flex flex-col h-[5px] items-start justify-center relative shrink-0 w-[87px]" data-name="Separator">
      <Component16 />
    </div>
  );
}

function Heading11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Solway:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[42px] text-nowrap">
        <p className="leading-[50.4px] whitespace-pre">{`Let's talk`}</p>
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Heading11 />
    </div>
  );
}

function Svg734246484248() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 87 5">
      <g clipPath="url(#clip0_5_1352)" id="svg-734246484_246">
        <path d={svgPaths.p272fcb00} id="Vector" stroke="var(--stroke-0, #474747)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      </g>
      <defs>
        <clipPath id="clip0_5_1352">
          <rect fill="white" height="5" width="87" />
        </clipPath>
      </defs>
    </svg>
  );
}

function Component17() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Component 1">
      <Svg734246484248 />
    </div>
  );
}

function Separator5() {
  return (
    <div className="content-stretch flex flex-col h-[5px] items-start justify-center relative shrink-0 w-[87px]" data-name="Separator">
      <Component17 />
    </div>
  );
}

function Title2() {
  return (
    <div className="content-stretch flex gap-[32px] items-center justify-center relative shrink-0 w-full" data-name="Title">
      <Separator4 />
      <Container83 />
      <Separator5 />
    </div>
  );
}

function Component2() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Component 2">
      <div className="flex flex-col font-['Gaegu:Light',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[38px] text-nowrap">
        <p className="leading-[45.6px] whitespace-pre">gahimaaristote1@gmail.com</p>
      </div>
    </div>
  );
}

function Container84() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pb-[0.6px] pt-0 px-0 relative shrink-0 w-full" data-name="Container">
      <Component2 />
    </div>
  );
}

function Container85() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container84 />
    </div>
  );
}

function Container86() {
  return (
    <div className="absolute inset-0 overflow-clip rounded-[16px]" data-name="Container">
      <div className="absolute left-0 rounded-[16px] size-[40px] top-0" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[#474747] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
    </div>
  );
}

function LinkSocialIcon4() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[40px]" data-name="Link - Social Icon">
      <Container86 />
    </div>
  );
}

function Container87() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <LinkSocialIcon4 />
    </div>
  );
}

function Container88() {
  return (
    <div className="absolute inset-0 overflow-clip rounded-[16px]" data-name="Container">
      <div className="absolute left-0 rounded-[16px] size-[40px] top-0" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[#474747] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
    </div>
  );
}

function LinkSocialIcon5() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[40px]" data-name="Link - Social Icon">
      <Container88 />
    </div>
  );
}

function Container89() {
  return (
    <div className="content-stretch flex flex-col items-start opacity-[0.995] relative shrink-0" data-name="Container">
      <LinkSocialIcon5 />
    </div>
  );
}

function Container90() {
  return (
    <div className="absolute inset-0 overflow-clip rounded-[16px]" data-name="Container">
      <div className="absolute left-0 rounded-[16px] size-[40px] top-0" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[#474747] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
    </div>
  );
}

function LinkSocialIcon6() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[40px]" data-name="Link - Social Icon">
      <Container90 />
    </div>
  );
}

function Container91() {
  return (
    <div className="content-stretch flex flex-col items-start opacity-[0.991] relative shrink-0" data-name="Container">
      <LinkSocialIcon6 />
    </div>
  );
}

function Container92() {
  return (
    <div className="absolute inset-0 overflow-clip rounded-[16px]" data-name="Container">
      <div className="absolute left-0 rounded-[16px] size-[40px] top-0" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[#474747] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
    </div>
  );
}

function LinkSocialIcon7() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[40px]" data-name="Link - Social Icon">
      <Container92 />
    </div>
  );
}

function Container93() {
  return (
    <div className="content-stretch flex flex-col items-start opacity-[0.992] relative shrink-0" data-name="Container">
      <LinkSocialIcon7 />
    </div>
  );
}

function Socials1() {
  return (
    <div className="content-stretch flex gap-[16px] h-[40px] items-center justify-center relative shrink-0" data-name="Socials">
      <Container87 />
      <Container89 />
      <Container91 />
      <Container93 />
    </div>
  );
}

function EmailAndSocials() {
  return (
    <div className="content-stretch flex flex-col gap-[10.01px] items-center relative shrink-0 w-full" data-name="Email and socials">
      <Container85 />
      <Socials1 />
    </div>
  );
}

function Container94() {
  return (
    <div className="box-border content-stretch flex flex-col items-start overflow-clip pb-[3px] pt-[2px] px-0 relative shrink-0 w-[320px]" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#b8bbd2] text-[20px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">Your Name</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex items-start justify-center px-[16px] py-[12.5px] relative size-full">
          <Container94 />
        </div>
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[50px] items-start justify-center overflow-clip relative rounded-[16px] shrink-0 w-full" data-name="Background">
      <Input />
      <div className="absolute inset-0 rounded-[16px]" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[#474747] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
    </div>
  );
}

function Label6() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Label">
      <Background2 />
    </div>
  );
}

function Container95() {
  return (
    <div className="box-border content-stretch flex flex-col items-start overflow-clip pb-[3px] pt-[2px] px-0 relative shrink-0 w-[320px]" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#b8bbd2] text-[20px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">Email Address</p>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex items-start justify-center px-[16px] py-[12.5px] relative size-full">
          <Container95 />
        </div>
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[50px] items-start justify-center overflow-clip relative rounded-[16px] shrink-0 w-full" data-name="Background">
      <Input1 />
      <div className="absolute inset-0 rounded-[16px]" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[#474747] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
    </div>
  );
}

function Label7() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Label">
      <Background3 />
    </div>
  );
}

function Container96() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-center overflow-clip relative shrink-0 w-full" data-name="Container">
      <Label6 />
      <Label7 />
    </div>
  );
}

function Container97() {
  return (
    <div className="absolute bottom-[60px] box-border content-stretch flex flex-col items-start left-[16px] pl-0 pr-[619.47px] py-0 top-[16px]" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#b8bbd2] text-[20px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">Message</p>
      </div>
    </div>
  );
}

function Textarea() {
  return (
    <div className="h-[100px] min-h-[100px] overflow-x-clip overflow-y-auto relative shrink-0 w-full" data-name="Textarea">
      <Container97 />
      <div className="absolute bottom-[60px] left-[16px] top-[16px] w-[688px]" data-name="Rectangle" />
    </div>
  );
}

function Label8() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start min-h-[100px] overflow-clip relative rounded-[16px] shrink-0 w-full" data-name="Label">
      <Textarea />
      <div className="absolute inset-0 rounded-[16px]" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[#474747] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
    </div>
  );
}

function Container98() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-nowrap text-white">
        <p className="leading-[28px] whitespace-pre">Send</p>
      </div>
    </div>
  );
}

function Container99() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container98 />
    </div>
  );
}

function ButtonDefault() {
  return (
    <div className="basis-0 bg-[#474747] box-border content-stretch flex grow items-center justify-center min-h-px min-w-px px-[340.58px] py-0 relative rounded-[16px] shrink-0" data-name="Button - Default">
      <Container99 />
    </div>
  );
}

function Container100() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start justify-center relative shrink-0" data-name="Container">
      <ButtonDefault />
    </div>
  );
}

function Form() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full" data-name="Form">
      <Container96 />
      <Label8 />
      <Container100 />
    </div>
  );
}

function Container101() {
  return (
    <div className="content-stretch flex flex-col gap-[100.01px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <EmailAndSocials />
      <Form />
    </div>
  );
}

function SectionContact() {
  return (
    <div className="content-stretch flex flex-col gap-[99px] items-center justify-center relative shrink-0 w-full" data-name="Section - Contact">
      <Title2 />
      <Container101 />
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Link">
      <div className="flex flex-col font-['Gaegu:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#8774ff] text-[24px] text-nowrap">
        <p className="[text-underline-position:from-font] decoration-solid leading-[48px] underline whitespace-pre">Aristote</p>
      </div>
    </div>
  );
}

function Container102() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Gaegu:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[24px] text-nowrap">
        <p className="leading-[48px] whitespace-pre">{`©2025 `}</p>
      </div>
      <Link />
    </div>
  );
}

function Container103() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container102 />
    </div>
  );
}

function FooterDesktop() {
  return (
    <div className="box-border content-stretch flex items-center justify-between max-w-[720px] opacity-[0.992] pb-0 pt-[1.01px] px-0 relative shrink-0" data-name="Footer - Desktop">
      <Container103 />
    </div>
  );
}

function Main() {
  return (
    <div className="content-stretch flex flex-col gap-[199px] items-center justify-center relative shrink-0 w-[720px]" data-name="Main">
      <HeaderHome />
      <SectionAbout />
      <SectionProjects />
      <SectionContact />
      <FooterDesktop />
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col items-center justify-center min-h-[900px] pb-[200px] pt-0 px-0 relative shrink-0 w-full" data-name="Background">
      <Bg />
      <Main />
    </div>
  );
}

function Container104() {
  return <div className="shrink-0 size-[30px]" data-name="Container" />;
}

function Button() {
  return (
    <div className="absolute bg-white box-border content-stretch flex h-[64px] items-center left-0 overflow-clip p-[16px] right-0 rounded-[24px] shadow-[0px_0.637px_2.166px_-1px_rgba(114,98,218,0.18),0px_1.932px_6.567px_-2px_rgba(114,98,218,0.18),0px_5.106px_17.361px_-3px_rgba(114,98,218,0.14),0px_16px_54.4px_-4px_rgba(114,98,218,0.05)] top-[18px]" data-name="Button">
      <Container104 />
      <div className="absolute left-0 rounded-[24px] size-[64px] top-0" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[rgba(184,187,210,0.1)] border-solid inset-0 pointer-events-none rounded-[24px]" />
      </div>
    </div>
  );
}

function LinkHome() {
  return (
    <button className="basis-0 block cursor-pointer grow min-h-px min-w-px overflow-visible relative shrink-0 w-full" data-name="Link - Home">
      <Button />
      <div className="absolute bg-[#8774ff] bottom-[11px] left-1/2 opacity-0 rounded-[20px] size-px translate-x-[-50%]" data-name="Background" />
    </button>
  );
}

function Container105() {
  return (
    <div className="content-stretch flex flex-col h-[100px] items-start justify-center relative shrink-0 w-[64px]" data-name="Container">
      <LinkHome />
    </div>
  );
}

function Container106() {
  return <div className="shrink-0 size-[30px]" data-name="Container" />;
}

function Button1() {
  return (
    <div className="absolute bg-white box-border content-stretch flex h-[64px] items-center left-0 overflow-clip p-[16px] right-0 rounded-[24px] shadow-[0px_0.637px_2.166px_-1px_rgba(114,98,218,0.18),0px_1.932px_6.567px_-2px_rgba(114,98,218,0.18),0px_5.106px_17.361px_-3px_rgba(114,98,218,0.14),0px_16px_54.4px_-4px_rgba(114,98,218,0.05)] top-[18px]" data-name="Button">
      <Container106 />
      <div className="absolute left-0 rounded-[24px] size-[64px] top-0" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[rgba(184,187,210,0.1)] border-solid inset-0 pointer-events-none rounded-[24px]" />
      </div>
    </div>
  );
}

function LinkHome1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Link - Home">
      <Button1 />
      <div className="absolute bg-[#8774ff] bottom-[11px] left-1/2 opacity-0 rounded-[20px] size-px translate-x-[-50%]" data-name="Background" />
    </div>
  );
}

function Container107() {
  return (
    <div className="content-stretch flex flex-col h-[100px] items-start justify-center relative shrink-0 w-[64px]" data-name="Container">
      <LinkHome1 />
    </div>
  );
}

function Component18() {
  return (
    <div className="relative shrink-0 size-[30px]" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="Component 1">
          <path d={svgPaths.p3cb2d200} fill="var(--fill-0, #B8BBD2)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ButtonSearchIcon() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-center min-h-px min-w-px relative self-stretch shrink-0" data-name="Button - Search Icon">
      <Component18 />
    </div>
  );
}

function Container112() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-0 min-h-[64px] overflow-clip right-0 rounded-[10px] top-0" data-name="Container">
      <ButtonSearchIcon />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-white h-[64px] left-0 overflow-clip right-0 rounded-[24px] shadow-[0px_0.637px_2.166px_-1px_rgba(114,98,218,0.18),0px_1.932px_6.567px_-2px_rgba(114,98,218,0.18),0px_5.106px_17.361px_-3px_rgba(114,98,218,0.14),0px_16px_54.4px_-4px_rgba(114,98,218,0.05)] top-[18px]" data-name="Button">
      <div className="absolute left-0 rounded-[24px] size-[64px] top-0" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[rgba(184,187,210,0.1)] border-solid inset-0 pointer-events-none rounded-[24px]" />
      </div>
      <Container112 />
    </div>
  );
}

function Home() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Home">
      <Button4 />
      <div className="absolute bg-[#8774ff] bottom-[11px] left-1/2 opacity-0 rounded-[20px] size-px translate-x-[-50%]" data-name="Background" />
    </div>
  );
}

function Container113() {
  return (
    <div className="content-stretch flex flex-col h-[100px] items-start justify-center relative shrink-0 w-[64px]" data-name="Container">
      <Home />
    </div>
  );
}

function NavDesktop() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[16px] items-center justify-center overflow-clip px-[16px] py-0 relative rounded-[24px] shadow-[0px_0.637px_1.401px_-0.938px_rgba(114,98,218,0.12),0px_1.932px_4.25px_-1.875px_rgba(114,98,218,0.11),0px_5.106px_11.233px_-2.813px_rgba(114,98,218,0.09),0px_16px_35.2px_-3.75px_rgba(114,98,218,0.04)] shrink-0" data-name="Nav - Desktop">
      <Container105 />
      {[...Array(2).keys()].map((_, i) => (
        <Container107 key={i} />
      ))}
      <Container105 />
      <Container113 />
      <div className="absolute inset-0 rounded-[24px]" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[#f5f6ff] border-solid inset-0 pointer-events-none rounded-[24px]" />
      </div>
    </div>
  );
}

function Container114() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <NavDesktop />
    </div>
  );
}

function NavigationContainer() {
  return (
    <div className="absolute bottom-[3606.63px] content-stretch flex items-center justify-center left-0 w-[1440px]" data-name="Navigation Container">
      <Container114 />
    </div>
  );
}

export default function Component1440WLight() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="1440w light">
      <NavigationContainer />
      <Background4 />
    </div>
  );
}