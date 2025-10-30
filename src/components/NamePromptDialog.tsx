import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface NamePromptDialogProps {
  onSubmit: (name: string) => void;
}

export function NamePromptDialog({ onSubmit }: NamePromptDialogProps) {
  const [name, setName] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show dialog after a short delay for better UX
    setTimeout(() => setIsVisible(true), 500);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setIsVisible(false);
    }
  };

  const handleSkip = () => {
    onSubmit('me');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] cursor-default"
            onClick={handleSkip}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] cursor-default w-[90%] max-w-[420px] md:w-[420px]"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-[#e5e7f0] cursor-default relative">
              {/* Close button */}
              <button
                onClick={handleSkip}
                className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-[#8c8fa6]" />
              </button>

              {/* Content */}
              <div className="text-center mb-5 md:mb-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#8774ff] to-[#a991ff] rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center">
                  <span className="text-white text-[28px] md:text-[32px]">👋</span>
                </div>
                <h2 className="font-['Solway'] text-[20px] md:text-[24px] text-[#474747] mb-2">
                  Welcome!
                </h2>
                <p className="font-['Gaegu'] text-[15px] md:text-[16px] text-[#8c8fa6] leading-relaxed px-2">
                  What's your name? Let's make this experience more personal. 
                  Your cursor will follow you around!
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name..."
                    maxLength={20}
                    className="w-full px-4 py-2.5 md:py-3 border border-[#e5e7f0] rounded-xl font-['Gaegu'] text-[15px] md:text-[16px] text-[#474747] placeholder:text-[#b8bbd2] focus:outline-none focus:ring-2 focus:ring-[#8774ff] focus:border-transparent transition-all"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2 md:gap-3">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="flex-1 px-3 md:px-4 py-2.5 md:py-3 border border-[#e5e7f0] rounded-xl font-['Gaegu'] text-[15px] md:text-[16px] text-[#8c8fa6] hover:bg-gray-50 transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-[#8774ff] rounded-xl font-['Gaegu'] text-[15px] md:text-[16px] text-white hover:bg-[#7563ee] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </form>

              {/* Privacy note */}
              <p className="mt-3 md:mt-4 text-center font-['Gaegu'] text-[11px] md:text-[12px] text-[#b8bbd2]">
                Your name is stored locally and never shared
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
