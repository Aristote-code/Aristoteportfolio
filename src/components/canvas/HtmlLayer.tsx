import { CanvasElement, Transform } from '../../types/canvas';
import { StickyNoteElement as StickyNoteType } from '../../types/canvas';
import { TextBoxElement as TextBoxType } from '../../types/canvas';
import { ImageElement as ImageType } from '../../types/canvas';
import { VideoElement } from '../../types/canvas';
import { EmojiElement } from '../../types/canvas';
import { StickyNoteElement } from './elements/StickyNoteElement';
import { TextBoxElement } from './elements/TextBoxElement';
import { VideoEmbedElement } from './elements/VideoEmbedElement';
import { ImageElement } from './elements/ImageElement';

interface HtmlLayerProps {
  elements: CanvasElement[];
  selectedIds: Set<string>;
  transform: Transform;
  onSelect: (id: string) => void;
  onUpdateElement: (id: string, patch: Partial<CanvasElement>) => void;
  onCommitElement: (id: string) => void;
  onElementDragStart: (id: string, e: React.PointerEvent) => void;
  onImageResize: (id: string, patch: Partial<ImageType>) => void;
}

export function HtmlLayer({
  elements,
  selectedIds,
  transform,
  onSelect,
  onUpdateElement,
  onCommitElement,
  onElementDragStart,
  onImageResize,
}: HtmlLayerProps) {
  const { scale, tx, ty } = transform;

  const htmlEls = elements.filter(
    e => e.elementType === 'sticky' ||
         e.elementType === 'text' ||
         e.elementType === 'video' ||
         e.elementType === 'image' ||
         e.elementType === 'emoji'
  );

  // Sort by zIndex so higher z renders on top
  const sorted = [...htmlEls].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {sorted.map(el => {
        const left = el.x * scale + tx;
        const top = el.y * scale + ty;
        const width = el.width * scale;
        const height = el.height * scale;

        return (
          <div
            key={el.id}
            style={{
              position: 'absolute',
              left,
              top,
              width,
              height,
              pointerEvents: 'auto',
              touchAction: 'none',
            }}
          >
            {el.elementType === 'sticky' && (
              <StickyNoteElement
                element={el as StickyNoteType}
                isSelected={selectedIds.has(el.id)}
                scale={scale}
                onSelect={() => onSelect(el.id)}
                onUpdate={patch => onUpdateElement(el.id, patch)}
                onCommit={() => onCommitElement(el.id)}
                onDragStart={e => onElementDragStart(el.id, e)}
              />
            )}
            {el.elementType === 'text' && (
              <TextBoxElement
                element={el as TextBoxType}
                isSelected={selectedIds.has(el.id)}
                scale={scale}
                onSelect={() => onSelect(el.id)}
                onUpdate={patch => onUpdateElement(el.id, patch)}
                onCommit={() => onCommitElement(el.id)}
                onDragStart={e => onElementDragStart(el.id, e)}
              />
            )}
            {el.elementType === 'video' && (
              <VideoEmbedElement
                element={el as VideoElement}
                isSelected={selectedIds.has(el.id)}
                scale={scale}
                onSelect={() => onSelect(el.id)}
                onDragStart={e => onElementDragStart(el.id, e)}
              />
            )}
            {el.elementType === 'image' && (
              <ImageElement
                element={el as ImageType}
                isSelected={selectedIds.has(el.id)}
                scale={scale}
                onSelect={() => onSelect(el.id)}
                onResize={patch => onImageResize(el.id, patch)}
                onCommit={() => onCommitElement(el.id)}
                onDragStart={e => onElementDragStart(el.id, e)}
              />
            )}
            {el.elementType === 'emoji' && (
              <EmojiElementDisplay
                element={el as EmojiElement}
                isSelected={selectedIds.has(el.id)}
                scale={scale}
                onSelect={() => onSelect(el.id)}
                onDragStart={e => onElementDragStart(el.id, e)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function EmojiElementDisplay({
  element,
  isSelected,
  onSelect,
  onDragStart,
}: {
  element: EmojiElement;
  isSelected: boolean;
  scale: number;
  onSelect: () => void;
  onDragStart: (e: React.PointerEvent) => void;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: element.size,
        cursor: 'grab',
        outline: isSelected ? '2px solid #4A90E2' : '2px solid transparent',
        outlineOffset: 4,
        borderRadius: 8,
        userSelect: 'none',
      }}
      onPointerDown={e => { e.stopPropagation(); onSelect(); onDragStart(e); }}
    >
      {element.emoji}
    </div>
  );
}
