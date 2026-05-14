import { motion } from "motion/react";
import { StickyNote } from "./StickyNote";
import { ExternalLink, Linkedin, Github, Mail, Twitter } from "lucide-react";
import { RiveIcon } from "./RiveIcon";


const experienceItems = [
  {
    company: "IST Group, Sweden Hybrid",
    role: "Senior Product Designer",
    period: "Jan 2026 - Present",
    description:
      "Designing end-to-end digital experiences across interaction, motion, usability, and scalable design systems for IST products.",
  },
  {
    company: "Health Connect, Remote",
    role: "Senior Product Designer",
    period: "Aug 2025 - Dec 2025",
    description:
      "Owned AI-powered healthcare SaaS workflows including voice-to-text notes, patient portals, usability testing, and a reusable design system.",
  },
  {
    company: "BAG Technologies",
    role: "Lead Product Designer",
    period: "Feb 2023 - Jul 2025",
    description:
      "Led web platform UX, design systems, and accessible product journeys that improved engagement, adoption, and task completion.",
  },
];

export function AboutSection() {
  const handleOpenResume = () => {
    window.open("/resume.pdf", "_blank", "noopener,noreferrer");
  };

  return (
    <section className="min-h-screen py-16 md:py-32 px-4 md:px-8">
      <div className="w-full max-w-[720px] mx-auto">
        {/* Title */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-12 md:mb-24">
          <div className="h-[3px] w-[40px] md:w-[87px] bg-[#474747] rounded-full"></div>
          <h2 className="text-[32px] md:text-[42px] font-['Solway'] text-[#474747] whitespace-nowrap">
            About
          </h2>
          <div className="h-[3px] w-[40px] md:w-[87px] bg-[#474747] rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[328px_1fr] gap-8 md:gap-16">
          {/* Left Column - Stickers and Profile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative md:h-[888px] mx-auto w-full max-w-[328px]"
          >
            {/* Mobile layout: Profile first, then stickers in grid */}
            <div className="md:hidden flex flex-col items-center">
              {/* Profile card */}
              <div className="mb-8">
                <div className="flex flex-col items-center">
                  {/* Image container with Figma styling */}
                  <div className="relative w-[119px] h-[119px] rounded-full overflow-hidden bg-[#e7e7e7] mb-4">
                    <img
                      src="/Profile image1.png"
                      alt="Gahima Aristote"
                      className="w-full h-full object-cover rounded-full"
                    />
                    {/* Border overlay */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 border-[3px] border-solid border-[#474747] rounded-full pointer-events-none"
                    />
                  </div>
                  <p className="text-[32px] font-['Gaegu'] text-[#474747] text-center leading-[38.4px]">
                    Yours Truly
                  </p>
                </div>
              </div>

              {/* Sticky notes in grid */}
              <div className="grid grid-cols-2 gap-4 mb-12">
                <StickyNote
                  text="8+ years&#10;in product"
                  color="green"
                  rotation={0}
                  draggable={true}
                />
                <StickyNote
                  text="Kigali"
                  color="cyan"
                  rotation={0}
                  draggable={true}
                />
                <StickyNote
                  text="versatile&#10;skill pool"
                  color="pink"
                  rotation={0}
                  draggable={true}
                />
                <StickyNote
                  text="Design&#10;systems&#10;+ motion"
                  color="yellow"
                  rotation={0}
                  draggable={true}
                />
                <StickyNote
                  text="Digital&#10;Product&#10;Innovator"
                  color="purple"
                  rotation={0}
                  draggable={true}
                />
                <StickyNote
                  text="Rive +&#10;React"
                  color="yellow"
                  rotation={0}
                  draggable={true}
                />
              </div>
            </div>

            {/* Desktop layout: Absolute positioned as before */}
            <div className="hidden md:block relative h-[888px]">
              {/* Sticky notes */}
              <div className="absolute top-[286px] left-[45px]">
                <StickyNote
                  text="8+ years&#10;in product"
                  color="green"
                  rotation={0}
                  draggable={true}
                />
              </div>

              <div className="absolute bottom-[253px] left-[138px]">
                <StickyNote
                  text="Kigali"
                  color="cyan"
                  rotation={0}
                  draggable={true}
                />
              </div>

              <div className="absolute top-[323px] left-[182px]">
                <StickyNote
                  text="versatile&#10;skill pool"
                  color="pink"
                  rotation={0}
                  draggable={true}
                />
              </div>

              <div className="absolute bottom-[311px] left-[24px]">
                <StickyNote
                  text="Design&#10;systems&#10;+ motion"
                  color="yellow"
                  rotation={0}
                  draggable={true}
                />
              </div>

              <div className="absolute bottom-[106px] left-[89px]">
                <StickyNote
                  text="Digital&#10;Product&#10;Innovator"
                  color="purple"
                  rotation={0}
                  draggable={true}
                />
              </div>

              <div className="absolute bottom-[7px] left-[177px]">
                <StickyNote
                  text="Rive +&#10;React"
                  color="yellow"
                  rotation={0}
                  draggable={true}
                />
              </div>

              {/* Profile card */}
              <div className="absolute top-[17px] left-[61px] w-[233px] h-[231px]">
                <div className="absolute left-[35px] top-[28px] w-[119px] h-[119px]">
                  {/* Image container with Figma styling */}
                  <div className="relative w-[119px] h-[119px] rounded-full overflow-hidden bg-[#e7e7e7]">
                    <img
                      src="/Profile image1.png"
                      alt="Gahima Aristote"
                      className="w-full h-full object-cover rounded-full"
                    />
                    {/* Border overlay */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 border-[3px] border-solid border-[#474747] rounded-full pointer-events-none"
                    />
                  </div>
                </div>
                <div className="absolute bottom-0 right-[7px]">
                  <p className="text-[32px] font-['Gaegu'] text-[#474747] text-center leading-[38.4px]">
                    Yours Truly
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 md:space-y-16"
          >
            {/* Links */}
            <div>
              <h3 className="text-[24px] md:text-[28px] font-['Solway'] text-[#474747] mb-4 md:mb-6 leading-[33.6px]">
                Links
              </h3>
              <div className="flex gap-4">
                {[
                  {
                    label: "LinkedIn",
                    icon: Linkedin,
                    href: "https://www.linkedin.com/in/gahima-aristote/",
                  },
                  {
                    label: "GitHub",
                    icon: Github,
                    href: "https://github.com/Aristote-code",
                  },
                  {
                    label: "Rive",
                    icon: RiveIcon,
                    href: "https://rive.app/@aristote/",
                  },
                  {
                    label: "Email",
                    icon: Mail,
                    href: "mailto:gahimaaristote1@gmail.com",
                  },
                  {
                    label: "Twitter",
                    icon: Twitter,
                    href: "https://x.com/GAristote",
                  },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    title={link.label}
                    className="w-10 h-10 rounded-2xl border-2 border-[#474747] flex items-center justify-center hover:bg-[#474747] hover:text-white transition-all duration-300 group"
                  >
                    <link.icon className="w-5 h-5 text-[#474747] group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-[24px] md:text-[28px] font-['Solway'] text-[#474747] mb-4 md:mb-6 leading-[33.6px]">
                Experience
              </h3>

              <div className="space-y-6">
                {experienceItems.map((item) => (
                  <div key={`${item.company}-${item.period}`}>
                    <h4 className="text-[18px] md:text-[20px] font-['Solway'] text-[#474747] mb-2 leading-[28px]">
                      {item.company}
                    </h4>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mb-2">
                      <span className="font-['Gaegu'] text-[16px] md:text-[18px] text-[#474747] leading-[21.6px]">
                        {item.role}
                      </span>
                      <span className="font-['Gaegu'] text-[14px] md:text-[16px] text-[#8c8fa6] leading-[21.6px]">
                        {item.period}
                      </span>
                    </div>
                    <p className="font-['Gaegu'] text-[16px] md:text-[18px] text-[#8c8fa6] leading-[21.6px]">
                      {item.description}
                    </p>
                  </div>
                ))}

                {/* Education */}
                <div>
                  <h3 className="text-[24px] md:text-[28px] font-['Solway'] text-[#474747] mb-4 md:mb-6 leading-[33.6px] pt-4">
                    Education
                  </h3>
                  <h4 className="text-[18px] md:text-[20px] font-['Solway'] text-[#474747] mb-2 leading-[28px]">
                    African Leadership University
                  </h4>
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mb-2">
                    <span className="font-['Gaegu'] text-[16px] md:text-[18px] text-[#474747] leading-[21.6px]">
                      BSc. (Hons) Software Engineering
                    </span>
                    <span className="font-['Gaegu'] text-[14px] md:text-[16px] text-[#8c8fa6] leading-[21.6px]">
                      Apr 2022 - Jul 2025
                    </span>
                  </div>
                  <p className="font-['Gaegu'] text-[16px] md:text-[18px] text-[#8c8fa6] leading-[21.6px]">
                    First Class Honors, 4.2/5 CGPA.
                  </p>
                </div>

                {/* Resume Button */}
                <button
                  onClick={handleOpenResume}
                  aria-label="Open resume in a new tab"
                  className="flex items-center gap-2 group mt-6 px-6 py-3 border-2 border-[#474747] rounded-2xl hover:bg-[#474747] hover:text-white transition-all duration-300"
                >
                  <span className="font-['Gaegu'] text-[20px] md:text-[24px] text-[#474747] group-hover:text-white leading-[28.8px] transition-colors">
                    Open Resume
                  </span>
                  <ExternalLink className="w-5 h-5 md:w-6 md:h-6 transition-colors" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
