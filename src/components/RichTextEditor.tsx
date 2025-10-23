import { useEffect, useRef, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Link as LinkIcon, 
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Minus
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  // Initialize content
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  // Handle text selection to show toolbar
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !editorRef.current?.contains(selection.anchorNode)) {
        setShowToolbar(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setToolbarPosition({
        top: rect.top - 50 + window.scrollY,
        left: rect.left + rect.width / 2,
      });
      setShowToolbar(true);
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const formatBlock = (tag: string) => {
    document.execCommand('formatBlock', false, tag);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const isActive = (command: string): boolean => {
    return document.queryCommandState(command);
  };

  const getBlockType = (): string => {
    const selection = window.getSelection();
    if (!selection || !selection.anchorNode) return 'p';
    
    let node = selection.anchorNode as HTMLElement;
    while (node && node !== editorRef.current) {
      if (node.tagName) {
        const tag = node.tagName.toLowerCase();
        if (['h1', 'h2', 'h3', 'p', 'blockquote'].includes(tag)) {
          return tag;
        }
      }
      node = node.parentElement as HTMLElement;
    }
    return 'p';
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
    <div className="relative">
      {/* Floating Toolbar */}
      {showToolbar && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-lg border border-[#e5e7f0] flex items-center gap-1 px-2 py-1.5 animate-in fade-in slide-in-from-top-2"
          style={{
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
            transform: 'translateX(-50%)',
          }}
        >
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
            icon={Heading1}
            onClick={() => formatBlock('h1')}
            active={getBlockType() === 'h1'}
            title="Heading 1"
          />
          <ToolbarButton
            icon={Heading2}
            onClick={() => formatBlock('h2')}
            active={getBlockType() === 'h2'}
            title="Heading 2"
          />
          <ToolbarButton
            icon={Heading3}
            onClick={() => formatBlock('h3')}
            active={getBlockType() === 'h3'}
            title="Heading 3"
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
            onClick={() => formatBlock('blockquote')}
            active={getBlockType() === 'blockquote'}
            title="Quote"
          />
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="w-full min-h-[120px] px-4 py-3 border border-transparent hover:bg-gray-50/30 focus:bg-white focus:border-[#e5e7f0] rounded-md font-['Gaegu'] text-[17px] text-[#474747] outline-none transition-all"
        style={{ lineHeight: '1.65' }}
        data-placeholder={placeholder}
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #d0d0d0;
          pointer-events: none;
        }
        
        [contenteditable] h1 {
          font-size: 28px;
          font-weight: 600;
          margin: 12px 0 8px 0;
          line-height: 1.3;
        }
        
        [contenteditable] h2 {
          font-size: 24px;
          font-weight: 600;
          margin: 10px 0 6px 0;
          line-height: 1.3;
        }
        
        [contenteditable] h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 8px 0 4px 0;
          line-height: 1.3;
        }
        
        [contenteditable] p {
          margin: 6px 0;
        }
        
        [contenteditable] ul,
        [contenteditable] ol {
          margin: 8px 0;
          padding-left: 24px;
        }
        
        [contenteditable] li {
          margin: 4px 0;
        }
        
        [contenteditable] blockquote {
          border-left: 3px solid #e5e7f0;
          padding-left: 16px;
          margin: 12px 0;
          color: #8c8fa6;
          font-style: italic;
        }
        
        [contenteditable] a {
          color: #8774ff;
          text-decoration: underline;
        }
        
        [contenteditable]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}
