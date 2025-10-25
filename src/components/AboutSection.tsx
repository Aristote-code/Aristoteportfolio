import { motion } from 'motion/react';
import { StickyNote } from './StickyNote';
import { Linkedin, Github, Mail, Twitter } from 'lucide-react';
import profileImage from '../assets/ad92ed337531b9fe2db9165a108b0ea27479a71c.png';

export function AboutSection() {
  const handleDownloadResume = () => {
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = '/resume.pdf'; // You'll need to add your resume.pdf to the public folder
    link.download = 'Gahima_Aristote_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="min-h-screen py-16 md:py-24 px-4 md:px-8">
      <div className="w-full max-w-[720px] mx-auto">
        {/* Title */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-12 md:mb-20">
          <div className="h-[2px] w-[40px] bg-[#474747] rounded-full"></div>
          <h2 className="text-[28px] md:text-[36px] font-['Solway'] text-[#474747] whitespace-nowrap">About</h2>
          <div className="h-[2px] w-[40px] bg-[#474747] rounded-full"></div>
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
                    <div 
                      className="absolute flex items-center justify-center left-[-48.44px] top-[-118.49px]"
                      style={{
                        width: 'calc(1px * ((281.203125 * 0.04331187903881073) + (205.140625 * 0.9990615844726562)))',
                        height: 'calc(1px * ((205.140625 * 0.04331187903881073) + (281.203125 * 0.9990615844726562)))'
                      }}
                    >
                      <div className="flex-none" style={{ transform: 'rotate(357.518deg)' }}>
                        <div className="relative w-[205.142px] h-[281.213px]">
                          <img 
                            src={profileImage} 
                            alt="Gahima Aristote" 
                            className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none"
                            style={{ objectPosition: '50% 50%' }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Border overlay */}
                    <div 
                      aria-hidden="true" 
                      className="absolute inset-0 border-[3px] border-solid border-[#474747] rounded-full pointer-events-none"
                    />
                  </div>
                  <p className="text-[32px] font-['Gaegu'] text-[#474747] text-center leading-[38.4px]">Yours Truly</p>
                </div>
              </div>

              {/* Sticky notes in grid */}
              <div className="grid grid-cols-2 gap-4 mb-12">
                <StickyNote
                  text="5+ years&#10;in startups"
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
                  text="Over five&#10;years of&#10;experience&#10;in the&#10;industry"
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
                  text="vibe&#10;coder"
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
                  text="5+ years&#10;in startups"
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
                  text="Over five&#10;years of&#10;experience&#10;in the&#10;industry"
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
                  text="vibe&#10;coder"
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
                    <div 
                      className="absolute flex items-center justify-center left-[-48.44px] top-[-118.49px]"
                      style={{
                        width: 'calc(1px * ((281.203125 * 0.04331187903881073) + (205.140625 * 0.9990615844726562)))',
                        height: 'calc(1px * ((205.140625 * 0.04331187903881073) + (281.203125 * 0.9990615844726562)))'
                      }}
                    >
                      <div className="flex-none" style={{ transform: 'rotate(357.518deg)' }}>
                        <div className="relative w-[205.142px] h-[281.213px]">
                          <img 
                            src={profileImage} 
                            alt="Gahima Aristote" 
                            className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none"
                            style={{ objectPosition: '50% 50%' }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Border overlay */}
                    <div 
                      aria-hidden="true" 
                      className="absolute inset-0 border-[3px] border-solid border-[#474747] rounded-full pointer-events-none"
                    />
                  </div>
                </div>
                <div className="absolute bottom-0 right-[7px]">
                  <p className="text-[32px] font-['Gaegu'] text-[#474747] text-center leading-[38.4px]">Yours Truly</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 md:space-y-12"
          >
            {/* Links */}
            <div>
              <h3 className="text-[24px] md:text-[28px] font-['Solway'] text-[#474747] mb-4 md:mb-6 leading-[1.2]">Links</h3>
              <div className="flex gap-4">
                {[
                  { icon: Linkedin, href: 'https://www.linkedin.com/in/gahima-aristote/' },
                  { icon: Github, href: 'https://github.com/Aristote-code' },
                  { icon: Mail, href: 'mailto:gahimaaristote1@gmail.com' },
                  { icon: Twitter, href: 'https://x.com/GAristote' }
                ].map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-2xl border-2 border-[#474747] flex items-center justify-center hover:bg-[#474747] hover:text-white transition-all duration-300 group"
                  >
                    <link.icon className="w-5 h-5 text-[#474747] group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-[24px] md:text-[28px] font-['Solway'] text-[#474747] mb-4 md:mb-6 leading-[1.2]">Skills</h3>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {['Framer', 'UI design', 'UX research', 'Animation', 'Prototyping', 'Branding'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 md:px-4 py-2 border-2 border-[#474747] rounded-2xl font-['Gaegu'] text-[20px] md:text-[24px] text-[#474747] leading-[28.8px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-[24px] md:text-[28px] font-['Solway'] text-[#474747] mb-4 md:mb-6 leading-[1.2]">Experience</h3>
              
              <div className="space-y-6 md:space-y-8">
                {/* Health Connect */}
                <div>
                  <h4 className="text-[18px] md:text-[20px] font-['Solway'] text-[#474747] mb-3 leading-[1.3]">Health Connect</h4>
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mb-3">
                    <span className="font-['Gaegu'] text-[16px] md:text-[18px] text-[#474747] leading-[1.5]">Senior Product Designer</span>
                    <span className="font-['Gaegu'] text-[14px] md:text-[16px] text-[#8c8fa6] leading-[1.5]">Aug 2025 – Present</span>
                  </div>
                  <p className="font-['Gaegu'] text-[16px] md:text-[18px] text-[#8c8fa6] leading-[1.7]">
                    Designed AI-driven healthcare tools — from voice-to-text notes to patient portals — improving usability and engagement.
                  </p>
                </div>

                {/* BAG Technologies */}
                <div>
                  <h4 className="text-[18px] md:text-[20px] font-['Solway'] text-[#474747] mb-3 leading-[1.3]">BAG Technologies</h4>
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mb-3">
                    <span className="font-['Gaegu'] text-[16px] md:text-[18px] text-[#474747] leading-[1.5]">Lead Product Designer</span>
                    <span className="font-['Gaegu'] text-[14px] md:text-[16px] text-[#8c8fa6] leading-[1.5]">Feb 2023 – Jul 2025</span>
                  </div>
                  <p className="font-['Gaegu'] text-[16px] md:text-[18px] text-[#8c8fa6] leading-[1.7]">
                    Designed BAG's web platform and design system, creating smoother user journeys and cohesive visual experiences.
                  </p>
                </div>

                {/* Download Resume Button */}
                <button 
                  onClick={handleDownloadResume}
                  className="flex items-center gap-2 group mt-8 md:mt-10 px-6 py-3 border-2 border-[#474747] rounded-2xl hover:bg-[#474747] hover:text-white transition-all duration-300"
                >
                  <span className="font-['Gaegu'] text-[20px] md:text-[24px] text-[#474747] group-hover:text-white leading-[1.5] transition-colors">Download Resume</span>
                  <svg className="w-5 h-5 md:w-6 md:h-6 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 10l5 5 5-5M12 15V3" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
