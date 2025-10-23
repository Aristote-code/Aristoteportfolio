import { Home, Sparkles, User, Mail, MessageSquare, Pencil } from 'lucide-react';
import { useState } from 'react';

interface IconNavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  isCommentMode: boolean;
  onToggleCommentMode: () => void;
  isDrawingMode?: boolean;
  onToggleDrawingMode?: () => void;
}

export function IconNavigation({ activeSection, onNavigate, isCommentMode, onToggleCommentMode, isDrawingMode, onToggleDrawingMode }: IconNavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', description: 'Back to the start' },
    { id: 'projects', icon: Sparkles, label: 'Projects', description: 'View featured work' },
    { id: 'about', icon: User, label: 'About', description: 'Learn about me' },
    { id: 'contact', icon: Mail, label: 'Contact', description: 'Get in touch' },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
      <div 
        className="bg-white rounded-[20px] px-3 py-2 flex gap-3 relative"
        style={{
          boxShadow: '0px 0.637px 1.401px -0.938px rgba(114,98,218,0.12), 0px 1.932px 4.25px -1.875px rgba(114,98,218,0.11), 0px 5.106px 11.233px -2.813px rgba(114,98,218,0.09), 0px 16px 35.2px -3.75px rgba(114,98,218,0.04)',
        }}
      >
        <div className="absolute inset-0 rounded-[20px] border-2 border-[#f5f6ff] pointer-events-none" />
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const isHovered = hoveredItem === item.id;
          
          return (
            <div 
              key={item.id} 
              className="relative h-[56px] w-[56px] flex items-center justify-center"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <button
                onClick={() => onNavigate(item.id)}
                className="w-full h-full bg-white rounded-[16px] flex items-center justify-center transition-all active:scale-95 group"
                aria-label={item.label}
                style={{
                  boxShadow: '0px 0.637px 2.166px -1px rgba(114,98,218,0.18), 0px 1.932px 6.567px -2px rgba(114,98,218,0.18), 0px 5.106px 17.361px -3px rgba(114,98,218,0.14), 0px 16px 54.4px -4px rgba(114,98,218,0.05)',
                }}
              >
                <div className="absolute inset-0 rounded-[16px] border-2 border-[rgba(184,187,210,0.1)] pointer-events-none" />
                <Icon 
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-[#8774ff]' : 'text-[#B8BBD2]'
                  }`}
                  strokeWidth={2}
                />
              </button>

              {/* Tooltip */}
              {isHovered && (
                <div className="absolute bottom-[68px] left-1/2 -translate-x-1/2 pointer-events-none z-[45]">
                  <div className="bg-[#1e1e1e] text-white px-3 py-1.5 rounded-lg whitespace-nowrap animate-in fade-in zoom-in-95 duration-200">
                    <div className="font-['Gaegu'] text-[15px] leading-[18px]">{item.label}</div>
                    {/* Tooltip arrow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1e1e1e] rotate-45" />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Divider */}
        <div className="w-px h-[56px] flex items-center justify-center">
          <div className="w-px h-8 bg-[#e5e7f0]" />
        </div>

        {/* Comment Button */}
        <div 
          className="relative h-[56px] w-[56px] flex items-center justify-center"
          onMouseEnter={() => setHoveredItem('comment')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <button
            onClick={onToggleCommentMode}
            className={`w-full h-full rounded-[16px] flex items-center justify-center transition-all active:scale-95 group ${
              isCommentMode ? 'bg-[#8774ff]' : 'bg-white'
            }`}
            aria-label="Add comment"
            style={{
              boxShadow: '0px 0.637px 2.166px -1px rgba(114,98,218,0.18), 0px 1.932px 6.567px -2px rgba(114,98,218,0.18), 0px 5.106px 17.361px -3px rgba(114,98,218,0.14), 0px 16px 54.4px -4px rgba(114,98,218,0.05)',
            }}
          >
            <div className="absolute inset-0 rounded-[16px] border-2 border-[rgba(184,187,210,0.1)] pointer-events-none" />
            <MessageSquare 
              className={`w-5 h-5 transition-colors ${
                isCommentMode ? 'text-white' : 'text-[#B8BBD2]'
              }`}
              strokeWidth={2}
            />
          </button>

          {/* Tooltip */}
          {hoveredItem === 'comment' && (
            <div className="absolute bottom-[68px] left-1/2 -translate-x-1/2 pointer-events-none z-[45]">
              <div className="bg-[#1e1e1e] text-white px-3 py-1.5 rounded-lg whitespace-nowrap animate-in fade-in zoom-in-95 duration-200">
                <div className="font-['Gaegu'] text-[15px] leading-[18px]">Comment</div>
                {/* Tooltip arrow */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1e1e1e] rotate-45" />
              </div>
            </div>
          )}
        </div>

        {/* Drawing Button - Desktop only */}
        {onToggleDrawingMode && (
          <div 
            className="relative h-[56px] w-[56px] items-center justify-center hidden md:flex"
            onMouseEnter={() => setHoveredItem('draw')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <button
              onClick={onToggleDrawingMode}
              className={`w-full h-full rounded-[16px] flex items-center justify-center transition-all active:scale-95 group ${
                isDrawingMode ? 'bg-[#8774ff]' : 'bg-white'
              }`}
              aria-label="Drawing mode"
              style={{
                boxShadow: '0px 0.637px 2.166px -1px rgba(114,98,218,0.18), 0px 1.932px 6.567px -2px rgba(114,98,218,0.18), 0px 5.106px 17.361px -3px rgba(114,98,218,0.14), 0px 16px 54.4px -4px rgba(114,98,218,0.05)',
              }}
            >
              <div className="absolute inset-0 rounded-[16px] border-2 border-[rgba(184,187,210,0.1)] pointer-events-none" />
              <Pencil 
                className={`w-5 h-5 transition-colors ${
                  isDrawingMode ? 'text-white' : 'text-[#B8BBD2]'
                }`}
                strokeWidth={2}
              />
            </button>

            {/* Tooltip */}
            {hoveredItem === 'draw' && (
              <div className="absolute bottom-[68px] left-1/2 -translate-x-1/2 pointer-events-none z-[45]">
                <div className="bg-[#1e1e1e] text-white px-3 py-1.5 rounded-lg whitespace-nowrap animate-in fade-in zoom-in-95 duration-200">
                  <div className="font-['Gaegu'] text-[15px] leading-[18px]">Draw</div>
                  {/* Tooltip arrow */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1e1e1e] rotate-45" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
