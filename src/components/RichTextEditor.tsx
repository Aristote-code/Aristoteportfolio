import { useEffect, useRef, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Link as LinkIcon, 
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 42, 48, 52, 60, 72];

export function RichTextEditor({ value, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [currentFontSize, setCurrentFontSize] = useState<number>(20);
  const [showFontSizes, setShowFontSizes] = useState(false);

  // Initialize content
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Track font size of current selection
  useEffect(() => {
    const updateFontSize = () => {
      const selection = window.getSelection();
      if (selection && selection.anchorNode && editorRef.current?.contains(selection.anchorNode)) {
        let node = selection.anchorNode as HTMLElement;
        if (node.nodeType === 3) { // Text node
          node = node.parentElement as HTMLElement;
        }
        if (node && node.style) {
          const fontSize = window.getComputedStyle(node).fontSize;
          const size = parseInt(fontSize);
          if (!isNaN(size)) {
            setCurrentFontSize(size);
          }
        }
      }
    };

    const handleSelectionChange = () => {
      updateFontSize();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    editorRef.current?.addEventListener('click', updateFontSize);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      editorRef.current?.removeEventListener('click', updateFontSize);
    };
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const setFontSize = (size: number) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      // If no selection, just set the current font size
      setCurrentFontSize(size);
      setShowFontSizes(false);
      return;
    }

    // Save the selection
    const range = selection.getRangeAt(0);
    
    // Create a span with the font size
    const span = document.createElement('span');
    span.style.fontSize = `${size}px`;
    
    try {
      // Extract the contents and wrap them
      const contents = range.extractContents();
      span.appendChild(contents);
      range.insertNode(span);
      
      // Restore selection
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.addRange(newRange);
      
      setCurrentFontSize(size);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    } catch (e) {
      console.error('Error setting font size:', e);
    }
    
    setShowFontSizes(false);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      alert('Please select some text first');
      return;
    }

    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const isActive = (command: string): boolean => {
    try {
      return document.queryCommandState(command);
    } catch (e) {
      return false;
    }
  };

  const ToolbarButton = ({ 
    icon: Icon, 
    onClick, 
    active, 
    title 
  }: { 
    icon: any; 
    onClick: () => void; 
    active?: boolean; 
    title: string; 
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent losing selection
      }}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        active ? 'bg-gray-200' : ''
      }`}
      title={title}
    >
      <Icon className="w-4 h-4 text-[#474747]" />
    </button>
  );

  return (
    <div className="relative border border-[#e5e7f0] rounded-lg overflow-hidden">
      {/* Fixed Toolbar at Top */}
      <div className="bg-[#f8f9fc] border-b border-[#e5e7f0] flex items-center gap-1 px-3 py-2 flex-wrap">
        {/* Font Size Selector */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              setShowFontSizes(!showFontSizes);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors border border-[#e5e7f0] bg-white"
            title="Font size"
          >
            <Type className="w-4 h-4 text-[#474747]" />
            <span className="text-[14px] text-[#474747] font-['Gaegu']">{currentFontSize}px</span>
          </button>
          
          {showFontSizes && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#e5e7f0] rounded-lg shadow-lg z-50 max-h-[200px] overflow-y-auto">
              {FONT_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    setFontSize(size);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors font-['Gaegu'] ${
                    currentFontSize === size ? 'bg-gray-100' : ''
                  }`}
                  style={{ fontSize: `${Math.min(size, 20)}px` }}
                >
                  {size}px
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-[#e5e7f0] mx-1" />
        
        <ToolbarButton
          icon={Bold}
          onClick={() => execCommand('bold')}
          active={isActive('bold')}
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton
          icon={Italic}
          onClick={() => execCommand('italic')}
          active={isActive('italic')}
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton
          icon={Underline}
          onClick={() => execCommand('underline')}
          active={isActive('underline')}
          title="Underline (Ctrl+U)"
        />
        <ToolbarButton
          icon={Strikethrough}
          onClick={() => execCommand('strikeThrough')}
          active={isActive('strikeThrough')}
          title="Strikethrough"
        />
        
        <div className="w-px h-6 bg-[#e5e7f0] mx-1" />
        
        <ToolbarButton
          icon={AlignLeft}
          onClick={() => execCommand('justifyLeft')}
          active={isActive('justifyLeft')}
          title="Align Left"
        />
        <ToolbarButton
          icon={AlignCenter}
          onClick={() => execCommand('justifyCenter')}
          active={isActive('justifyCenter')}
          title="Align Center"
        />
        <ToolbarButton
          icon={AlignRight}
          onClick={() => execCommand('justifyRight')}
          active={isActive('justifyRight')}
          title="Align Right"
        />
        
        <div className="w-px h-6 bg-[#e5e7f0] mx-1" />
        
        <ToolbarButton
          icon={List}
          onClick={() => execCommand('insertUnorderedList')}
          active={isActive('insertUnorderedList')}
          title="Bullet List"
        />
        <ToolbarButton
          icon={ListOrdered}
          onClick={() => execCommand('insertOrderedList')}
          active={isActive('insertOrderedList')}
          title="Numbered List"
        />
        
        <div className="w-px h-6 bg-[#e5e7f0] mx-1" />
        
        <ToolbarButton
          icon={LinkIcon}
          onClick={insertLink}
          active={isActive('createLink')}
          title="Insert Link"
        />
        <ToolbarButton
          icon={Quote}
          onClick={() => {
            execCommand('formatBlock', 'blockquote');
          }}
          title="Quote"
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onClick={() => {
          // Close font size dropdown when clicking in editor
          setShowFontSizes(false);
        }}
        className="w-full min-h-[200px] px-4 py-3 bg-white font-['Gaegu'] text-[20px] text-[#8c8fa6] outline-none"
        style={{ lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}
        data-placeholder={placeholder}
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #d0d0d0;
          pointer-events: none;
        }
        
        [contenteditable] * {
          font-family: 'Gaegu', sans-serif;
        }
        
        [contenteditable] p {
          margin: 6px 0;
          color: #8c8fa6;
          font-size: 20px;
          line-height: 24px;
          font-weight: 400;
        }
        
        [contenteditable] span {
          color: #8c8fa6;
        }
        
        [contenteditable] ul,
        [contenteditable] ol {
          margin: 8px 0;
          padding-left: 24px;
          color: #8c8fa6;
          font-size: 20px;
          line-height: 24px;
        }
        
        [contenteditable] li {
          margin: 4px 0;
          color: #8c8fa6;
        }
        
        [contenteditable] blockquote {
          border-left: 3px solid #e5e7f0;
          padding-left: 16px;
          margin: 12px 0;
          color: #8c8fa6;
          font-style: italic;
          font-size: 20px;
          line-height: 24px;
        }
        
        [contenteditable] a {
          color: #8774ff;
          text-decoration: underline;
        }
        
        [contenteditable]:focus {
          outline: none;
        }

        [contenteditable] strong, 
        [contenteditable] b {
          font-weight: 600;
        }

        [contenteditable] em,
        [contenteditable] i {
          font-style: italic;
        }

        [contenteditable] u {
          text-decoration: underline;
        }

        [contenteditable] div,
        [contenteditable] span {
          display: inline;
        }

        [contenteditable] div:after {
          content: '';
          display: block;
        }
      `}</style>
    </div>
  );
}
