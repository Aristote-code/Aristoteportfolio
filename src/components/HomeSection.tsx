import { motion } from 'motion/react';
import { StickyNote } from './StickyNote';

export function HomeSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 md:px-8 relative">
      <div className="w-full max-w-[720px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center relative"
        >
          <h1 className="text-[36px] md:text-[52px] font-['Solway'] mb-1 text-[#474747] leading-[1.2]">Hi, I'm Aristote</h1>
          <p className="text-[#8c8fa6] text-[18px] md:text-[24px] font-['Gaegu'] leading-[28.8px]">A product designer at Health Connect.</p>

          {/* Decorative sticky notes - positioned relative to the centered content */}
          <div className="hidden md:block absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute" style={{ right: '-100px', top: '-50px' }}>
              <div className="pointer-events-auto">
                <StickyNote
                  text="👋"
                  color="yellow"
                  initialX={0}
                  initialY={0}
                  rotation={-6}
                  size="large"
                />
              </div>
            </div>
            
            <div className="absolute" style={{ right: '-50px', bottom: '-120px' }}>
              <div className="pointer-events-auto">
                <StickyNote
                  text="How can&#10;I help you"
                  color="green"
                  initialX={0}
                  initialY={0}
                  rotation={16}
                />
              </div>
            </div>
          </div>
          
          {/* Mobile hand wave */}
          <div className="md:hidden flex justify-center mt-8">
            <StickyNote
              text="👋"
              color="yellow"
              initialX={0}
              initialY={0}
              rotation={-6}
              size="large"
              draggable={false}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
