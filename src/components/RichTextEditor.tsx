import { useEffect, useRef } from 'react';
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
  Quote,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize content
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
    }
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
      <div className="bg-[#f8f9fc] border-b border-[#e5e7f0] flex items-center gap-1 px-3 py-2">
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

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
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
        
        [contenteditable] h1 {
          font-size: 28px;
          font-weight: 600;
          margin: 12px 0 8px 0;
          line-height: 1.3;
          color: #474747;
        }
        
        [contenteditable] h2 {
          font-size: 24px;
          font-weight: 600;
          margin: 10px 0 6px 0;
          line-height: 1.3;
          color: #474747;
        }
        
        [contenteditable] h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 8px 0 4px 0;
          line-height: 1.3;
          color: #474747;
        }
        
        [contenteditable] p {
          margin: 6px 0;
          color: #8c8fa6;
          font-size: 20px;
          line-height: 24px;
          font-weight: 400;
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

        [contenteditable] strong, [contenteditable] b {
          color: #474747;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
